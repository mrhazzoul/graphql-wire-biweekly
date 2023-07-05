/**
 * Created by mrhazzoul on 29/6/2023.
 */

import {api, LightningElement} from 'lwc';

export default class EmptyState extends LightningElement {
    @api
    title;
    
    @api
    message;
}