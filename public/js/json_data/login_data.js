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
    CurrentCategoryId:2,
    Categories:[
        {
            Id:1,
            Name:"Culture",
        },
        {
            Id:2,
            Name:"Tech",
        },
    ],
    Posts:[
        {
            Id:1,
            User:{
                UserName : 'pacal403',
            },
            Title:'Est-il possible de naître deux fois ?',
            Content:`Lynlee Hope, la petite fille de Lewisville au Texas (États-Unis), est née deux fois. Alors que sa mère était enceinte de 16 semaines, une échographie a révélé que le bébé souffrait d’un type de tumeur infantile au niveau du coccyx, connue sous le nom de tératome sacro-coccygien. ...`,
            Image:'https://picsum.photos/200',
            Categories: ["Culture","Tech"],
            Date: new Date()
        },
        {
            Id:2,
            User:{
                UserName : 'preydady',
            },
            Title:'Il faut quelques millisecondes pour que les sig...',
            Content:`Les humains sont en retard sur la réalité, et c'est pire que vous ne le pensez ; non seulement il faut plusieurs millisecondes à des dizaines de millisecondes pour que les signaux de notre appareil sensoriel atteignent le cerveau (d'ailleurs les signaux de douleur arrivent encore plus lentemen...`,
            Image:'https://picsum.photos/200',
            Categories: ["Culture","Tech"],
            Date: new Date()
        }
    ]
}