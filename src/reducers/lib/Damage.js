class Damage {
  static deal({ damage, car, location}) {
    console.log(`${damage} dealt to car ${car.id} at ${location}`);
    console.log(car.color);
    if (location.length === 1) {
      console.log(`side: ${location}`);
      console.log(`armor there: ${car.design.components.armor[location]}`);
      var damage_to_deal = damage;
      switch (location) {
        case 'F':
          damage_to_deal = this.damage_armor({ car, damage, location });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location });
          damage_to_deal = this.damage_plant({ car, damage: damage_to_deal });
          damage_to_deal = this.damage_crew({ car, damage: damage_to_deal });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location: 'B' });
          damage_to_deal = this.damage_armor({ car, damage: damage_to_deal, location: 'B' });
          break;
        case 'B':
          damage_to_deal = this.damage_armor({ car, damage, location });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location });
          damage_to_deal = this.damage_plant({ car, damage: damage_to_deal });
          damage_to_deal = this.damage_crew({ car, damage: damage_to_deal });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location: 'F' });
          damage_to_deal = this.damage_armor({ car, damage: damage_to_deal, location: 'F' });
          break;
        case 'R':
          damage_to_deal = this.damage_armor({ car, damage, location });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location });
          // BUGBUG: assumes no cargo
          if (Math.floor(Math.random() * 2)) {
            damage_to_deal = this.damage_plant({ car, damage: damage_to_deal });
          } else {
            damage_to_deal = this.damage_crew({ car, damage: damage_to_deal });
          }
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location: 'L' });
          damage_to_deal = this.damage_armor({ car, damage: damage_to_deal, location: 'L' });
          break;
        case 'L':
          damage_to_deal = this.damage_armor({ car, damage, location });
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location });
          // BUGBUG: assumes no cargo
          if (Math.floor(Math.random() * 2)) {
            damage_to_deal = this.damage_plant({ car, damage: damage_to_deal });
          } else {
            damage_to_deal = this.damage_crew({ car, damage: damage_to_deal });
          }
          damage_to_deal = this.damage_weapons({ car, damage: damage_to_deal, location: 'R' });
          damage_to_deal = this.damage_armor({ car, damage: damage_to_deal, location: 'R' });
          break;
        case 'U':
        case 'T':
        default:
          throw new Error(`unknown side: "${location}"`);
      }
    } else if (location.length === 2) {
      this.damage_tire({ car, damage, location });
    } else {
      throw new Error(`unknown target (name) type: "${location}"`);
    }
  }

  static damage_tire({ car, damage, location }) {
    var tire = car.design.components.tires.find(function(tire){return tire.location === location});
    // deal w/ handling on hit?
    tire.damage_points -= damage;
  }

  static damage_armor({ car, damage, location }) {
    car.design.components.armor[location] -= damage;
    var remaining = 0;
    if (car.design.components.armor[location] < 0) {
      remaining = -car.design.components.armor[location];
      car.design.components.armor[location] = 0;
    }
    return remaining;
  }

  static damage_weapons({ car, damage, location }) {
    // randomly choose which weapon is hit
    var this_side_weapons = car.design.components.weapons.filter(weapon => {
      return weapon.location === location;
    });
    if (this_side_weapons.length < 1) { return damage; }

    var hit_weapon = this_side_weapons[Math.floor(Math.random() * this_side_weapons.length)];

    hit_weapon.damage_points -= damage;
    var remaining = 0;
    if (hit_weapon.damage_points < 0) {
      remaining = -hit_weapon.damage_points;
      hit_weapon.damage_points = 0;
    }
    return remaining;
  }

  static damage_plant({ car, damage }) {
    car.design.components.power_plant.damage_points -= damage;
    var remaining = 0;
    if (car.design.components.power_plant.damage_points < 0) {
      remaining = -car.design.components.power_plant.damage_points;
      car.design.components.power_plant.damage_points = 0;
    }
    return remaining;
  }

  // BUGBUG: handle driver injury effects
  // BUGBUG: Also p.29 has details about hitting random crew. Current
  // design doesn't support that.
  static damage_crew({ car, damage }) {
    const random_crew_member = (car) => {
      const keys = Array.from(Object.keys(car.design.components.crew));
      return keys[Math.floor(Math.random() * keys.length)];
    }
    const crew_member = car.design.components.crew[random_crew_member(car)];
    crew_member.damage_points -= damage;
    var remaining = 0;
    if (crew_member.damage_points < 0) {
      remaining = - crew_member.damage_points;
      crew_member.damage_points = 0;
    }
    return remaining;
  }
}
export default Damage;
