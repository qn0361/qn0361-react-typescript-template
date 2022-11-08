/* eslint-disable */
const path = require('path')
const fs = require('fs')

const inputPath = path.resolve(__dirname, '../src/api/_out/api.ts')
const specPath = path.resolve(__dirname, '../src/api/_out/api_test.spec.ts')

const data = fs.readFileSync(inputPath)
const fd = fs.openSync(inputPath, 'w+')
const insert = Buffer.from('// @ts-nocheck\n')
fs.writeSync(fd, insert, 0, insert.length, 0)
fs.writeSync(fd, data, 0, data.length, insert.length)
fs.unlinkSync(specPath)

fs.close(fd, (err) => {
  if (err) throw err
})
