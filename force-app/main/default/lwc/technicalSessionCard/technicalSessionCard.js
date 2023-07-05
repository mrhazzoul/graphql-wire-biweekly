/**
 * Created by mrhazzoul on 29/6/2023.
 */

import {api, LightningElement} from 'lwc';

export default class TechnicalSessionCard extends LightningElement {
    @api
    technicalSession;
    
    get iconName() {
        switch (this.technicalSession.status) {
            case 'Upcoming': return 'utility:date_input'
            case 'In Progress': return 'utility:clock'
            case 'Canceled': return 'utility:close'
            case 'Done': return 'utility:success'
        }
    }
    
    get badgeClassNames() {
        switch (this.technicalSession.status) {
            case 'Upcoming': return 'slds-m-right_xxx-small'
            case 'In Progress': return 'slds-m-right_xxx-small badge-in-progress'
            case 'Canceled': return 'slds-m-right_xxx-small badge-canceled'
            case 'Done': return 'slds-m-right_xxx-small badge-done'
        }

    }
}