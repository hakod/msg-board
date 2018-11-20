/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb')
var ObjectId = require('mongodb').ObjectID

var CONNECT = process.env.DB

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .put((req, res)=>{
      let g = req.body.board
      let t = req.body.thread_id
      MongoClient.connect(CONNECT,(err,db)=>{
      let col = db.db('masd')
      let coll = col.collection('Board')
      console.log(g,t)
      try{coll.updateOne({name:g},{$set:{"threads.$[i].reported":true}},
                     {arrayFilters:[{"i._id":ObjectId(t)}]})        
                     res.send('success')
         } catch(e){console.log(e)}
      })
  })
  
    .post((req,res)=>{
    let g = req.params.board
    MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
      coll.findOne({name: g},(err,doc)=>{
        if(!doc){  
          coll.insert({name: g, threads: [{_id: new ObjectId(), text: req.body.text,delete_password:
          req.body.delete_password, created_on: new Date() 
          ,bumped_on: new Date(),reported: false, replies:[],replycount:0}]})
        } else {
          coll.findOneAndUpdate({name: g},{$push:{threads:{_id:new ObjectId(),text: req.body.text,
          created_on: new Date() 
          ,bumped_on: new Date(),reported: false, delete_password:req.body.delete_password,replies:[],replycount:0}}})
        }          
        res.redirect('/b/'+g)
      })      
    }) 
  }) 
  .get((req,res)=>{
    let g = req.params.board
    MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
      coll.aggregate([{$match:{name: g}},
        {$unwind: "$threads"},
        {$sort: {"threads.bumped_on":-1}},
        {$group:{_id:"$_id",threads: {$push: "$threads"}}},
        {$project: {'threads.reported':0,'threads.delete_password':0}},
        {$project: {'threads.replies.reported':0,'threads.replies.delete_password':0}},
        {$project: {'threads': { $slice: [ "$threads", 10 ] }}}
      ]).toArray((err,doc)=>{       
        doc[0].threads.map(x=>x.replies = x.replies.slice(-3))
        res.send(doc[0].threads)
      })
      })
    })
  .delete((req,res)=>{
    let g = req.body.board
    let i = req.body.thread_id
    let p = req.body.delete_password
    MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
      //pulls object from array
      coll.updateOne({name: g},{$pull:{"threads":{_id:ObjectId(i),delete_password:p}}})
      
      coll.findOne({threads:{$elemMatch:{_id: ObjectId(i)}}},(err,doc)=>{
        if(doc){
          res.send('incorrect password')
        } else {
          res.send('success')
        }
      })            
    })   
  })
  
  app.route('/api/replies/:board')
    .put((req, res)=>{
      let g = req.body.board
      let t = req.body.thread_id
      let p = req.body.reply_id
      MongoClient.connect(CONNECT, (err, db)=>{
      let col = db.db('masd')
      let coll = col.collection('Board')
        try{coll.updateOne({name:g},{$set:{"threads.$[i].replies.$[j].reported":true}},
                       {arrayFilters:[{"i._id":ObjectId(t)},{"j._id":ObjectId(p)}]})
                        res.send('success')}
        catch (e) {console.log(e)}
      })
  
  })
    .post((req,res)=>{
      let g = req.params.board
      let o = req.body.thread_id
    MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
        coll.updateOne({name: g,'threads._id':ObjectId(req.body.thread_id)},{'$push':{'threads.$.replies':{
        _id:new ObjectId(),text: req.body.text,created_on:new Date(),delete_password:req.body.delete_password,
        reported:false}},$inc:{'threads.$.replycount':1},'$set':{'threads.$.bumped_on':new Date()}})        
      })        
    res.redirect('/b/'+g+'/'+req.body.thread_id)
    })
  .get((req,res)=>{
    let g = req.params.board    
    let o = req.query.thread_id
   MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
      
      coll.aggregate([
        {$match:{name:g}},
        {$project:{threads:{$filter:{input:"$threads",as:"thread",cond:{$eq:["$$thread._id",ObjectId(o)]}}}}},
        {$project: {'threads.reported':0,'threads.delete_password':0}},
        {$project: {'threads.replies.reported':0,'threads.replies.delete_password':0}},             
        ])      
        .toArray((err,doc)=>{
          console.log(doc)
          res.send(doc[0].threads[0])
      })
    })
  })
  .delete((req,res)=>{
    let g = req.params.board
    let t = req.body.thread_id
    let r = req.body.reply_id
    let d = req.body.delete_password
    MongoClient.connect(CONNECT,(err,db)=>{
    let col = db.db('masd')
    let coll = col.collection('Board')
  
    try{coll.updateOne({name:g},
                {$set:{'threads.$[i].replies.$[j].text':'[deleted]'}},
                {arrayFilters:[{"i._id":ObjectId(t)},{"j._id":ObjectId(r),'j.delete_password':d}]})       
                res.send('success')
       }
      catch (e){
        res.send('incorrect password')
      }
    
    })     
  })
}
