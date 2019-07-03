create table user (
	id    int  not null  auto_increment,
    username varchar(20) not null,
    `password` varchar(255) not null,
    nickname varchar(60) not null,
    phone varchar(20) not null,
    primary key (id)
);

create table follow (
	follower   int not null,
    followee   int not null,
    foreign key (follower) references user(id),
    foreign key (followee) references user(id)
);

create table joins (
	id   int not null,
    aid  int not null,
    foreign key (id) references user(id)
)