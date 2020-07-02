import Order from '../_db/order';

import moment from 'moment';

export function invoiceGenerator(order) {
    // invoice format is "<YEAR>/<6-DIGIT-NUMBER>"
    // Example - 2020/001264
    
    // if no orders
    if(!order) {
        let firstInvoiceOfFinYear = moment().year()+ '/000001';
        return firstInvoiceOfFinYear;
    }
    // if orders are found, check the last invoice number
    let lastInvoiceNumber = order.invoice.split('/')[1];
    let newInvoiceNumber = String(parseInt(lastInvoiceNumber) + 1);

    // add zeros to the beginnning of the invoice number to make it 6 digit number
    let zerosAddedInvoiceNumber = newInvoiceNumber;
    for (let i = 0; i < 6 - newInvoiceNumber.length; i++) {
        zerosAddedInvoiceNumber = '0' + zerosAddedInvoiceNumber;           
    }
    let newInvoice = moment().year() + '/' + zerosAddedInvoiceNumber;
    return newInvoice; //a new invoice number in String type.

}