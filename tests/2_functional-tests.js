/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('test post', function(done){
      chai.request(server)
        .post('/api/threads/board')
        .send({board: 'a', text: 'hi', delete_password:'hi'})
        .end((err,res)=>{
          assert.equal(res.status, 200)
          done()
      })
    })
    })
    
    suite('GET', function() {
      test('test get', function(done){
      chai.request(server)
        .get('/api/threads/board')
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.property(res.body[0],'text')
          assert.property(res.body[0],'bumped_on')
          assert.property(res.body[0],'replies')
          assert.property(res.body[0],'replycount')
          assert.isAtMost(res.body.length,10)
          done()
      })      
      })
    });
    
    suite('DELETE', function() {
      test('test delete', function(done){
      chai.request(server)
        .delete('/api/threads/board')
        .send({delete_password: 'hi',board: 'board',thread_id: '5be532ea5b18000a8e1fe4a9' })        
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'success')
          done()
      })
      })
    });
    
    suite('PUT', function() {
      test('test put', function(done){
      chai.request(server)
        .put('/api/threads/board')
        .send({board: 'board', thread_id: '5be532ee23b78e0adda87afa'})
        .end((err,res)=>{
          assert.equal(res.status, 200)
          assert.equal(res.text, 'success')
          done()
      })
      })
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('post reply',function(done){
        chai.request(server)
          .post('/api/replies/board')
          .send({board:'board',thread_id:'5be609e6f8b7e61ba653aaf8',text:'hi',delete_password:'hi'})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            done()
        })      
      })
    });
    
    suite('GET', function() {
      test('get reply', function(done){
        chai.request(server)
          .get('/api/replies/board?thread_id=5be609e6f8b7e61ba653aaf8')
          .end((err,res)=>{
            assert.equal(res.status, 200)
            assert.property(res.body,'_id')
            assert.property(res.body,'text')
            assert.property(res.body,'created_on')
            assert.property(res.body,'bumped_on')
            assert.property(res.body,'replies')
            assert.property(res.body,'replycount')
            done()
        })
      })
    });
    
    suite('PUT', function() {
      test('test reply put',function(done){
        chai.request(server)
          .put('/api/replies/board')
          .send({board:'board',thread_id:'5be609e6f8b7e61ba653aaf8',reply_id:'5be60a5722f41a1d0b5d24c6'})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'success')
            done()
        })
      })
    });
    
    suite('DELETE', function() {
      test('delete reply', function(done){
        chai.request(server)
          .delete('/api/replies/board')
          .send({board:'board',thread_id:'5be609e6f8b7e61ba653aaf8',reply_id:'5be60a5722f41a1d0b5d24c6',delete_password:'hi'})
          .end((err, res)=>{
            assert.equal(res.status, 200)
            assert.equal(res.text, 'success')
            done()
        })
      })
    });
    
  });

});
