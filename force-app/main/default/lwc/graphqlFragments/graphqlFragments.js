/**
 * Created by mrhazzoul on 3/7/2023.
 */

export const TECHNICAL_SESSION_FIELDS_FRAGMENT = `
        Id
        Name {
            value
        }
        Title__c {
            value
        }
        Status__c {
            displayValue
        }
        Date__c {
            value
            displayValue
        }
        Presenter__r {
            Name {
                value
            }
            Image__c {
                value
            }
        }
`