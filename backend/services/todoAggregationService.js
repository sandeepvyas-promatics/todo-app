import mongoose from "mongoose";
import Todo from "../models/Todo.js";

const getTodosWithAggregation = async (
    userId,
    status = "all",
    priority = "all",
    sort = "dueDateAsc",
    search = ""
)=>{
    // 1. match only this user's todos
    const matchStage = { user : new mongoose.Types.ObjectId(userId), };

    // 2. built filter for the todo list
    const filterStage = {};

    //status filter
    if(status === "completed"){
        filterStage.completed = true;
    }
    if(status === "pending"){
        filterStage.completed = false;
    }
    if(status === "overdue"){
        filterStage.completed = false;
        filterStage.dueDate = {$lt : new Date()};
    }

    // priority filter
    if(priority !== "all"){
        filterStage.priority = priority;
    }

    // serach filter
    if (search && search.trim() !== ""){
        const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        filterStage.$or= [
            {title:{$regex : safeSearch, $options : "i"}},
            {description :{ $regex : safeSearch, $options : "i"}}    
        ];
    }

    // 3. sorting
    let sortStage ={};

    if(sort === "dueDateAsc"){
        sortStage = { dueDate : 1};
    }

    if(sort === "dueDateDesc"){
        sortStage = { dueDate : -1};
    }

    if(sort === "newest"){
       sortStage = { createdAt : -1}; 
    }
    if(sort === "oldest"){
        sortStage = { createdAt : 1};
    }

    // 4. Aggregation

    const Result = await Todo.aggregate([
        {
            $match : matchStage,
        },
        {
            $facet:{

                stats:[
                    {
                        $group:{
                            _id : null,
                            total : {$sum : 1},
                            completed: {
                                $sum: {
                                    $cond:[{$eq : ["$completed", true]},1,0],
                                },
                            },
                            pending: {
                                $sum: {
                                    $cond: [{ $eq: ["$completed",false]},1,0],
                                },
                            },
                            high:{
                                $sum:{
                                    $cond: [{$eq:["$priority","high"]},1,0],
                                },
                            },
                            medium:{
                                $sum:{
                                    $cond:[{$eq: ["$priority","medium"]},1,0],
                                },
                            },
                            low:{
                                $sum:{
                                    $cond:[{$eq: ["$priority","low"]},1,0],
                                },
                            },
                            overdue:{
                                $sum:{
                                    $cond:[
                                        {
                                            $and:[
                                                {$eq: ["$completed", false]},
                                                {$lt: ["$dueDate", new Date()]},
                                            ],
                                        },1,0   
                                ,],
                            },
                            },
                        },
                    },
                ],
                // Filtered TODOS
                todos:[
                    {
                        $match: filterStage,
                    },
                    {
                        $sort : sortStage,
                    }
                ],

                // total matching
                totalMatching: [
                    {
                        $match : filterStage,
                    },
                    {
                        $count : "count",
                    },
                ],
            },
        },
    ]);
    const result = Result[0];
    return {
        stats: result.stats[0] || {
            total: 0,
            completed: 0,
            pending: 0,
            overdue: 0,
        },
        todos:result.todos,
        totalMatching: result.totalMatching[0]?.count || 0,
    };
};

export default getTodosWithAggregation;