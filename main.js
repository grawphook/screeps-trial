require('prototype.spawn')();
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTower = require('role.tower');

module.exports.loop = function() {
    
    //
    // Cleanup memory of expired creeps
    for (let name in Memory.creeps) {
        if (Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
    }

    //
    // Run each creeps role
    for (let name in Game.creeps) {
        var creep = Game.creeps[name];
        
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        else if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
    
    //
    // Get all the towers for the main room and attack hostile creeps
    var towers = Game.rooms.E81N91.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_TOWER
    });
    for (let tower of towers) {
        roleTower.run(tower);
    }
    
    //
    // Set role minimums.  Note that some roles overlap
    // TODO: look at moving to a const or config file
    var minimumNumberOfHarvesters = 4;
    var minimumNumberOfUpgraders = 3;
    var minimumNumberOfBuilders = 1;
    var minimumNumberOfRepairers = 2;
    
    //
    // count the number of creeps in each role
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfBuilders = _.sum(Game.creeps, (c) => c.memory.role == 'builder');
    var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
    
    //
    // Determine the max energy that the spawn can use when all extensions and spawn are full
    var energy = Game.spawns.FirstSpawn.room.energyCapacityAvailable;
    var name = undefined;

    //
    // Saftey code 
    // TODO: remove
    if (numberOfHarvesters < 4) {
        energy = 300;
    } else {
        energy = 500;
    }
    
    //
    // Harvesters take priority
    if (numberOfHarvesters < minimumNumberOfHarvesters) {
        name = Game.spawns.FirstSpawn.createCustomCreep(energy, 'harvester');
        
        //
        // If there are no harvesters and not enough energy to create one, create the biggest one you can
        if (name == ERR_NOT_ENOUGH_ENERGY && numberOfHarvesters == 0) {
            name = Game.spawns.FirstSpawn.createCustomCreep(Game.spawns.Spawn1.room.energyAvailable, 'harvester');
        }
    }
    else if (numberOfUpgraders < minimumNumberOfUpgraders) {
        name = Game.spawns.FirstSpawn.createCustomCreep(energy, 'upgrader');
    }
    else if (numberOfRepairers < minimumNumberOfRepairers)
    {
        name = Game.spawns.FirstSpawn.createCustomCreep(energy, 'repairer');
    }
    else if (numberOfBuilders < minimumNumberOfBuilders)
    {
        name = Game.spawns.FirstSpawn.createCustomCreep(energy, 'builder');
    }
    else {
        name = Game.spawns.FirstSpawn.createCustomCreep(energy, 'builder');
    }
};