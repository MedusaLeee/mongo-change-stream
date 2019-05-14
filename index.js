const Promise = require('bluebird')
const User = require('./model/User')

const findTest = () => {
    User.find({}, (err, list) => {
        if (err) {
            return console.log(err)
        }
        console.log(list)
    })
}

// changeStream

const changeStreamTest = async () => {
    User.watch().on('change', data => {
        console.log('stream: ', data)
    })
    await Promise.delay(1000)
    const tom = await User.create({ name: 'tom1', age: 30 })
    tom.name = 'tom2'
    await tom.save()
    await User.updateOne({ _id: tom._id }, { $set: { age: 31 } })
    await User.deleteOne({ _id: tom._id })
}

const main = () => {
    changeStreamTest()
}
main()
