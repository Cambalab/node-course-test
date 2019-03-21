module.exports = (mongoose,request, config) => {
  const Evaluation = mongoose.model("Evaluation");
  const Student = mongoose.model("Student");

  /**
   * failuresByStates - Lists the failures by state.
   *
   * @param  {type} req description
   * @param  {type} res description
   * @return {Array<State,Number>} data
   */
  function failuresByStates(req, res) {
    Evaluation.find({'notes.status':'failed'}).populate('students')
    .then(evaluations => {
     
      //Iterates over evaluations
      const students = evaluations.reduce( (retArray, curr) => {
        //Iterates over notes and build a StudentID array
        const aux = curr.notes.reduce( (retArray, item) => { 
          if (item.status === 'failed') 
            return retArray.concat(item.studentId)
          else
            return retArray
          }, [] );
        return retArray.concat(aux);
      }, [] );

      return students;
    })
    .then( students => {
      console.log(students);
      //Now we need to populate students addresses
      Student.find({'_id': { $in: students}})
      .then( students => {
        
        //reduce student array to <State,Number> array
        const states = students.reduce( (obj, curr) => {

          if (curr.billingAddress  && curr.billingAddress.state){
            if (obj[curr.billingAddress.state])
            obj[curr.billingAddress.state] = obj[curr.billingAddress.state] + 1
            else{
              obj[curr.billingAddress.state] = 1;
            }
          }
          
          return obj;
        }, {})

        res.response200(states);
      })
    })
    .catch((err) => {
      res.response500(err, "evaluations couldn't be found!");
    });
  }

  return {
    failuresByStates
  };
};
