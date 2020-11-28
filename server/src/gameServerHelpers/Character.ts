import { DATA } from '../DATA'

class Character {
  static withId({ id }: { id: string }) /*: Character*/ {
    return DATA.characters.find((element: any) => element.id === id)
  }

  static skillLevel({ skill, character }: { skill: string; character: any }) {
    // use level === -1 as code for not even base level skill
    let points = character.skills.find((element: any) => element.name === skill).points
    let level = -1
    let toNextLevel = 10

    while (points > 0) {
      level += points >= 3 * toNextLevel ? 3 : Math.floor(points / 3)
      points -= 3 * toNextLevel
      toNextLevel += 10
    }
    return level
  }
}

export default Character
