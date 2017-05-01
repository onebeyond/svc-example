const assert = require('chai').assert
const clock = require('groundhog-day').fake
const async = require('async')

describe('Store (memory)', () => {
    const system = require('../../test-system')()
    createSuite('memory', system)
})

describe('Store (postgres)', () => {
    const system = require('../../../server/system')().set('clock', clock())
    createSuite('postgres', system)
})

function createSuite(label, system) {

    let store

    before(done => {
        system.start((err, components) => {
            if (err) return done(err)
            store = components.store
            done()
        })
    })

    beforeEach((done) => {
        async.series([
            cb => store.reset(cb),
        ], done)
    })

    after((done) => {
        if (!store) return done()
        async.series([
            cb => store.reset(cb),
            cb => system.stop(cb)
        ], done)
    })

    it(`${label}: should roundtrip customer`, (done) => {
        store.saveCustomer({id: '123', title: 'Mr', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }, (err) => {
            assert.ifError(err)
            store.getCustomer('123', (err, record) => {
                assert.ifError(err)
                assert.equal(record.id, '123')
                assert.equal(record.title, 'Mr')
                assert.equal(record.firstName, 'Bob')
                assert.equal(record.lastName, 'Holness')
                assert.equal(record.dateOfBirth, '1928-11-12')
                assert.equal(record.created.toISOString(), '2016-02-02T11:00:00.000Z')
                assert.equal(record.updated, undefined)
                done()
            })
        })
    })

    it(`${label}: should return undefined for non existing customer`, (done) => {
        store.getCustomer('123', (err, record) => {
            assert.ifError(err)
            assert.equal(record, undefined)
            done()
        })
    })

    it(`${label}: should update customer`, (done) => {
        store.saveCustomer({id: '123', title: 'Mr', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }, (err) => {
            assert.ifError(err)
            store.saveCustomer({id: '123', title: 'Sir', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1928-11-12' }, (err) => {
                assert.ifError(err)
                store.getCustomer('123', (err, record) => {
                    assert.ifError(err)
                    assert.equal(record.id, '123')
                    assert.equal(record.title, 'Sir')
                    assert.equal(record.firstName, 'Bob')
                    assert.equal(record.lastName, 'Holness')
                    assert.equal(record.dateOfBirth, '1928-11-12')
                    assert.equal(record.created.toISOString(), '2016-02-02T11:00:00.000Z')
                    assert.equal(record.updated.toISOString(), '2016-02-02T11:00:00.000Z')
                    done()
                })
            })
        })
    })

    it(`${label}: should delete an existing customer`, (done) => {
        store.saveCustomer({id: '123', title: 'Mr', firstName: 'Bob', lastName: 'Holness', dateOfBirth: '1960-01-15' }, (err) => {
            assert.ifError(err)
            store.deleteCustomer('123', (err, deleted) => {
                assert.ifError(err)
                assert.equal(deleted, true)
                store.getCustomer('123', (err, record) => {
                    assert.ifError(err)
                    assert.equal(undefined, record)
                    done()
                })
            })
        })
    })

    it(`${label}: should tolerate attempts to delete a non existing customer`, (done) => {
        store.deleteCustomer('123', (err, deleted) => {
            assert.ifError(err)
            assert.equal(deleted, false)
            done()
        })
    })
}
