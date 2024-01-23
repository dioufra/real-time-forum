export default {
    UserData: {
        IsAuth : true,
        FirstName : 'Cheikh',
        LastName : 'Ndiaye',
        UserName : 'cheikhndiaye9',
        Email : 'khechbrain@gmail.com',
        Age: '19',
        Gender:'Male',
    },
    Users:{
        ConnectedUsers:[],
        
    },
    Posts:[
        {
            Id:1,
            User_id:4,
            Title:'Poste Title 1',
            Content:'Post content 1',
            Image:'https://picsum.photos/200',
            Categories: ["Culture","Tech"],
            Date: new Date()
        },
        {
            Id:2,
            User_id:4,
            Title:'Poste Title 2',
            Content:'Post content 2',
            Image:'https://picsum.photos/200',
            Categories: ["Culture","Tech"],
            Date: new Date()
        }
    ]
}