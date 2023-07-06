/**
 * Created by mrhazzoul on 28/6/2023.
 */

import {LightningElement, wire} from 'lwc';
import {graphql, gql} from "lightning/uiGraphQLApi";
import {TECHNICAL_SESSION_FIELDS_FRAGMENT} from "c/graphqlFragments";

// The delay used when debouncing event handlers before invoking GraphQL.
const DELAY = 300;

export default class TechnicalSessionsContainer extends LightningElement {
    _technicalSessions = [];
    presenterOrSessionName = "%";
    isLoading;
    delayTimeout;
    
    
    options = [
        {label: "Upcoming", value: "Upcoming"},
        {label: "In Progress", value: "In Progress"},
        {label: "Done", value: "Done"},
        {label: "Canceled", value: "Canceled"}
    ]
    
    selectedStatuses = [];
    
    @wire(graphql, {
        query: gql`
            query technicalSessions(
                $statuses: [Picklist]
                $name: String
                $nameWithSpace: String
                $title: TextArea
                $titleWithSpace: TextArea
            ) {
                uiapi {
                    query {
                        TechnicalSession__c(
                            orderBy: {
                                Date__c: {
                                    order: DESC
                                }
                            }
                            where: {
                                and: [
                                    { Status__c: { in: $statuses } }
                                    {
                                        or: [
                                            { Presenter__r: { Name: { like: $name } } }
                                            { Presenter__r: { Name: { like: $nameWithSpace } } }
                                            { Title__c: {like : $title}}
                                            { Title__c: {like : $titleWithSpace}}
                                        ]
                                    }
                                ]
                            }
                        ) {
                            edges {
                                node {
                                    ${TECHNICAL_SESSION_FIELDS_FRAGMENT}
                                }    
                                
                            }
                        }
                    }
                }
            }
        `,
        variables: '$variables'
    })
    queryTechnicalSessions({data, errors}){
        if (data) {
            this.technicalSessions = data.uiapi.query.TechnicalSession__c.edges.map(edge => ({
                id: edge.node.Id,
                title: edge.node.Title__c.value,
                status: edge.node.Status__c.displayValue,
                date: edge.node.Date__c.value,
                presenterName: edge.node.Presenter__r.Name.value,
                presenterImage: edge.node.Presenter__r.Image__c.value
            }));

        } else if (errors) {
            console.log(errors);
        }
        this.isLoading = false;
    }
    
    handleStatusChange(event) {
        this.selectedStatuses = [...event.target.value];
    }
    
    handlePresenterNameChange(event) {
        // Debouncing this method: Do not update the reactive property as long as this function is
        // being called within a delay of DELAY. This is to avoid a very large number of GraphQL method calls.
        const searchKey = event.target.value;
        window.clearTimeout(this.delayTimeout);
        this.delayTimeout = setTimeout(() => {
            this.presenterOrSessionName = searchKey;
        }, DELAY);
    }
    
    get variables() {
        this.isLoading = true;
        return {
            statuses: this.selectedStatuses.length ? this.selectedStatuses : ["Upcoming", "In Progress", "Done", "Canceled"],
            name: `${this.presenterOrSessionName}%`,
            nameWithSpace: `% ${this.presenterOrSessionName}%`,
            title: `${this.presenterOrSessionName}%`,
            titleWithSpace: `% ${this.presenterOrSessionName}%`
        }
    }
    
    get technicalSessions() {
        return this._technicalSessions.length ? this._technicalSessions : null;
    }
    
    set technicalSessions(value) {
        this._technicalSessions = [...value];
    }
    
}