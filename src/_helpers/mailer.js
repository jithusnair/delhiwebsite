import SendGridMail from '@sendgrid/mail';

SendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
let templates = {
    verification: "d-5d47c18d06f742be859e0ec68528f721",
    resetPassword: "d-b0a658f0f90f4ebdbe9d913d6fb49e22",
    invoice: "d-0878f88275fc469393518a331c4086cd"
};

export function verifyEmail(data) {
    const msg = {
        to: data.email,
        from: {
            name: 'Direction Academy',
            email:"support@direction-academy.com"
        },
        templateId: templates.verification,      
        dynamic_template_data: {
            token: data.token
        }
    }
    return SendGridMail.send(msg);
}

export function resetPassword(data) {
    const msg = {
        to: data.email,
        from: {
            name: 'Direction Academy',
            email:"support@direction-academy.com"
        },
        templateId: templates.resetPassword,      
        dynamic_template_data: {
            url: data.url,
            name: data.name
        }
    }
    return SendGridMail.send(msg);
}

export function invoice(data) {
    const msg = {
        to: data.email,
        from: {
            name: 'Direction Academy',
            email:"support@direction-academy.com"
        },
        templateId: templates.invoice,      
        dynamic_template_data: {
            courseName: data.courseName,
            subTotal: data.subTotal,
            gstAmount: data.gstAmount,
            totalAmount: data.totalAmount,
            invoiceNumber: data.invoiceNumber,
            dateIssued: data.dateIssued,
            customerName: data.customerName,
            customerEmail: data.customerEmail,
            customerContact: data.customerContact
        }
    }
    return SendGridMail.send(msg);
}