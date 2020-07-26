import Sector from '../../_db/sector';

import nodecache from 'node-cache';

const navCache = new nodecache({stdTTL: 60*15}); //ttl of 15 minutes

export async function get(req, res, next) {
    let message;

    let value = navCache.get( "nav" );
    if ( value != undefined ){
        message = {success: true, data: value,};
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(message));
        return;
    }
    
    Sector.aggregate(
        [
            {$unset : ["__v"]},
            {$lookup : {
                    from: "exams",
                    let: { id: "$_id"},
                    pipeline: [
                        { $match: { $expr: { $eq: [ "$sectorId",  "$$id" ] },}},
                        { $project: { __v: 0, heads: 0, details: 0,  examTitle:0, sectorId: 0, _id:0} }
                     ],
                    as: "exams"
                }
            },
        ])
        .then((docs)=> {
            navCache.set('nav', docs);
            message = {success: true, data: docs,};
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
        .catch((error) => {
            console.log(error);
            message = { 
                success: false, 
                serverErr: 
                `Something went wrong. Couldn't get videos from database! 
                Please try again later.`
            };
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(message));
        })
}