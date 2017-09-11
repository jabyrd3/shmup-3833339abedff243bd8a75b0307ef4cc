'use strict';
/* globals _, engine */
window.initGame = function () {
  console.log('initgame');
    // you're really better off leaving this line alone, i promise.
  const command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';

  var bounds,
      scents = {};

    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and robots for subsequent steps
  const parseInput = (input) => {
        //
        // task #1 
        //
        // replace the 'parsed' variable below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the southeast corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        //

        // replace this with a correct object
    let lines = input.split('\n');
    let tempBounds = lines.shift();

    bounds = tempBounds.trim().split(' ').map(Number);

    var parsed = {
      bounds: bounds,
      robos: []
    };

    while (lines.length) {
      let t = lines.shift();
      let loc = t.trim().split(' ');
      let cmds = lines.shift();

      parsed.robos.push({
        o: loc.pop().toUpperCase(),
        y: Number(loc.pop()),
        x: Number(loc.pop()),
        command: cmds.trim()
      });
    }

    return parsed;
  };

  const getMovement = (orientation) => {
    return {
      'N': [0, -1],
      'S': [0, 1],
      'E': [1, 0],
      'W': [-1, 0]
    }[orientation];
  };

  const updateOrientation = (orientation, cmd) => {
    const o = {
      'N': ['W', 'E'],
      'S': ['E', 'W'],
      'E': ['N', 'S'],
      'W': ['S', 'N']
    }[orientation];

    return cmd === 'l' ? o[0] : o[1];
  };

  const advanceRobo = (x, y, o) => {
    let movement = getMovement(o);

    return [x, y].map((num, index) => {
      return num + movement[index];
    });
  };

  const addScent = (x, y) => {
    if (scents[x] === undefined) scents[x] = [];

    scents[x].push(y);
  };

  const hasScent = (x, y) => {
    if (scents[x] === undefined) return false;

    return scents[x].includes(y);
  };

  const deadRobo = (x, y)  => {
    let [bx, by] = bounds;

    return x > bx || x < 0 || y > by || y < 0;
  };

    // this function replaces the robos after they complete one instruction
    // from their commandset
  const tickRobos = (robos) => {
        // 
        // task #2
        //
        // in this function, write business logic to move robots around the playfield
        // the 'robos' input is an array of objects; each object has 4 parameters.
        // This function needs to edit each robot in the array so that its x/y coordinates
        // and orientation parameters match the robot state after 1 command has been completed. 
        // Also, you need to remove the command the robot just completed from the command list.
        // example input:
        //
        // robos[0] = {x: 2, y: 2, o: 'N', command: 'frlrlrl'}
        //
        //                   - becomes -
        // 
        // robos[0] = {x: 2, y: 1, o: 'N', command: 'rlrlrl'} 
        //
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        // write robot logic here

    robos.map((r) => {
      if (!r.command.length) {
        return r;
      }

      // current command
      let cmd = r.command[0].toLowerCase();

      // remove the first command
      r.command = r.command.substring(1);

      // just change orientation
      if (cmd !== 'f') {
        r.o = updateOrientation(r.o, cmd);
        return r;
      }

      let newLocation = advanceRobo(r.x, r.y, r.o);

      // check for a scent
      // TODO - just bc it has a scent doesnt mean they cant move _across_ it

      // check if we need to mark some scents
      if (deadRobo(newLocation[0], newLocation[1])) {

        if (hasScent(r.x, r.y)) {
          return r;
        }

        r.dead = true;

        addScent(r.x, r.y);

        return r;
      }

      r.x = newLocation[0];
      r.y = newLocation[1];

      return r;
    });

    return robos.filter((r) => {
      return !r.dead;
    });
        // return the mutated robos object from the input to match the new state
        // return ???;
  };
    // mission summary function
  const missionSummary = (robos) => {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
    return;
  };

    // leave this alone please
  return {
    parse: parseInput,
    tick: tickRobos,
    summary: missionSummary,
    command: command
  };
};

