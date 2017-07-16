/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.builder');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function (tower) {
        console.log('Tower code');
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        } else {
            //
            // See about repairing some walls, just don't use too much energy
            var percentFull = (tower.energy / tower.energyCapacity) * 100;

            console.log('Tower is '+ percentFull + 'percent full');
            // tower.
        }
    }
};