import Petitioner from '../../_db/petitioner';

export async function post(req, res, next) {
    let message;
    // check first if the petitioner already exists before signing petition
    Petitioner.findOne({email: req.body.email}).exec()
    .then((doc)=>{
        if(doc) {
            let e = new Error('Already signed');
            e.name = 'DuplicateSignature';
            throw e;
        }

        let petitioner = new Petitioner({
            fullname: req.body.fullname,
            mobile: req.body.mobile,
            profession: req.body.profession,
            email: req.body.email, 
            dob: new Date(req.body.date),
            address: req.body.address,
        });

        return petitioner.save()
    })
    .then(()=>{
        message = {
            success: true, 
            message: `Thank you for signing the petition for this just cause.`
        };
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
    .catch((error) => {
        if(error.name == 'DuplicateSignature') {
            message = {
                success: true, 
                message: `You have signed the petition once before. Thanks Again!`
            };
        }
        else {
            console.log(error);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong. Couldn't sign the petition`
            };
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
    })
}