const router = require("express").Router();
const List = require('../Models/List');
const verify = require("../VerifyToken")

//CREATE

router.post('/', verify, async (req, res) => {
    if (req.user.isAdmin) {
        const newList = new List(req.body);
        try {
            const savedList = await newList.save();
            res.status(200).json(savedList)
        } catch (err) {
            res.status(500).json(err)
        }

    }
    else {
        res.status(403).json('You are not allowed to add list')
    }
});

//DELETE

router.delete('/:id', verify, async (req, res) => {
    if (req.user.isAdmin) {
        try {
            await List.findByIdAndDelete(req.params.id);
            res.status(200).json('The list has been deleted')
        } catch (err) {
            res.status(500).json(err)
        }

    }
    else {
        res.status(403).json('You are not allowed to add list')
    }
});

//GET


    //here im saying that if there s is a type which mean the user clicked on movie it will fetch movie and the clicked on the genre it will show the movies that contains that genre

  // here im displaying if im on series or movies but without clicking or requesting a genre
  
  //if not im fetching random movie or series to display

router.get('/', verify, async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];


    try {
        if (typeQuery) {
            if (genreQuery) {
                list = await List.aggregate([
                    { $sample: { size: 7 } },
                    { $match: { type: typeQuery, genre: genreQuery } }
                ])
            }

            else{
                list = await List.aggregate([
                    { $sample: { size: 7 } },
                    { $match: { type: typeQuery} }
                ])
            }
            

        } else {
            list = await List.aggregate([{ $sample: { size: 7 } }]);

        }
          res.status(200).json(list)
    } catch (err) {
        res.status(500).json(err)
    }

})


module.exports = router;