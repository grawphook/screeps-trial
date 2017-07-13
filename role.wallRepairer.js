var roleBuilder = require('role.builder');

module.exports = {
    run: function(creep) {
        
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        
        if (creep.memory.working == true) {
            var walls = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_WALL
            });
            
            var target = undefined;

            for (let percentage = 0.0001; percentage <= 1; percentage += 0.0001) {
                target = creep.pos.findClosestByPath(walls, {
                    filter: (w) => w.hits / w.hitsMax < percentage
                });
                
                if (target != undefined) {
                    break;
                }
            }
            
            if (target != undefined) {
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else {
                roleBuilder.run(creep);
            }
            
            
            // var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL});
            
            // if (structure != undefined) {
            //     if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
            //         creep.moveTo(structure);
            //     }
            // }
            // else {
            //     roleBuilder.run(creep);
            // }
        }
        else {
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};