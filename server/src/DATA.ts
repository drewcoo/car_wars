import _ from 'lodash'
import fs from 'fs'

let WEAPONS: any
fs.readFile(`./src/vehicle/components/weapons.json`, 'utf8', (err, data) => {
  WEAPONS = JSON.parse(data)
})

const designs: any = []
fs.readdir('./src/vehicle/newDesigns', (err, files) => {
  files.forEach(fileName => {
    fs.readFile(`./src/vehicle/newDesigns/${fileName}`, 'utf8', (err, data) => {
      let json = JSON.parse(data)
      json.components.weapons = json.components.weapons.map((weapon: any) => {
        let found = _.cloneDeep(WEAPONS.find((elem: any) => elem.abbreviation === weapon.abbreviation))
        found.location = weapon.location
        return found
      })
      designs.push(json)
    })
  })
})

export const DATA: any = {
  cars: [],
  characters: [],
  designs: designs,
  matches: [],
  players: [],
}