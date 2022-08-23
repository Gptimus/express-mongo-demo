import mongoose from "mongoose";
import 'dotenv/config'

mongoose
    .connect(`mongodb://localhost/${process.env.MONGODB_DB_NAME}`)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Couldn\'t connect to MongoDB...', err));

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 191,
        //match: /pattern/
    },
    category: {
        type: String,
        required: true,
        enum: ['web', 'mobile', 'network'],
        lowercase: true,
        //uppercase: true,
        trim: true,
    },
    author: String,
    tags: {
        type: Array,
        validate: {
            validator: function (v) {
                return v && v.length > 0
            },
            message: 'A course should have at least one tag.'
        }
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function () {
            return this.isPublished
        },
        min: 10,
        max: 200,
        get: v => Math.round(v),
        set: v => Math.round(v),
    }
})

const Course = mongoose.model('Course', courseSchema)

async function createCourse() {
    const course = new Course({
        name: "Angular Course",
        author: "Guerth",
        category: "Web",
        tags: ['angular', 'frontend'],
        isPublished: true,
        price: 15.8
    })

    try {
        const result = await course.save()
        console.log(result)
    } catch (e) {
        for (const field in e.errors) {
            console.log(e.errors[field].message)
        }
    }

}

async function getCourses() {
    // eq (equal)
    // ne (not equal)
    // gt (greater than)
    // gte (greater than or equal to)
    // lt (less than)
    // lte (less than or equal to)
    // in
    // nin (not in)

    // or
    // and

    const pageNumber = 2
    const pageSize = 10


    const courses = await Course
        .find({author: "Guerth", isPublished: true})
        //.skip((pageNumber - 1) * pageSize)
        //.limit(pageSize)
        //.find({ price: {$gt: 10, $lte: 20}})
        //.find({ price: {$in: [10, 20, 30, 50, 100]}})
        //.find()
        //.or([{author: "Guerth"}, {isPublished: true}])
        //.and([])

        // Starts with Guerth
        //.find({ author: /^Guerth/})

        // Ends with Manzala
        //.find({ author: /Manzala$/i})

        // Contains Guerth
        //.find({ author: /.*Guerth.*/i})

        .limit(10)
        .sort({name: 1})
        .select({name: 1, tags: 1})
    //.count()
    console.log(courses)
}

async function updateCourse(id) {
    // const course = await Course.findById(id);
    // if(!course) return;
    // course.isPublished= true
    // course.author = "Optimus"
    //
    // // course.set({
    // //     isPublished: true,
    // //     author: "Optimus"
    // // })
    // const result = await course.save();

    // const result = await Course.update({_id: id}, {
    //     $set: {
    //         author: "Guerth",
    //         isPublished: false
    //     }
    // });
    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            author: "Guerth",
            isPublished: true
        }
    }, {new: true});


    console.log(course)
}

async function removeCourse(id) {
    //const result = Course.deleteOne({_id: id})
    const course = Course.findByIdAndRemove({_id: id})
    console.log(course)
}

//await removeCourse("6304900a6db1084dd4e79aee")
//await updateCourse("63048fc4659a3e43e5e8b93b")

//await getCourses()

createCourse()
