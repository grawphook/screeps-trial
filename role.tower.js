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
        var repair = true;

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target != undefined) {
            tower.attack(target);
        } else if (repair) {
            //
            // See about repairing some walls, just don't use too much energy
            var percentFull = (tower.energy / tower.energyCapacity) * 100;

            console.log('Tower is ' + percentFull + ' percent full');
            if (percentFull > 90) {
                var walls = tower.room.find(FIND_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_WALL
                });

                var target = undefined;

                target = tower.pos.findClosestByPath(walls, {
                    filter: (w) => w.hits / w.hitsMax < 0.0001
                });

                if (target != undefined) {
                    tower.repair(target);
                }
            }
        }
    }
};