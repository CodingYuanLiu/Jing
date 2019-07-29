# Application Interface of Jing

## Global Error Codes

Code | Description | Status
---- | ----- | ----
101  | Need login | Status Unauthorized (401)
102  | Bad Jwt token | Status Unauthorized (401)
103  | Bad Credential | Status Unauthorized (401)
104  | Banned | Status Unauthorized (401)
105  | Need Admin Privileges | Status Forbidden (403)
201  | Parameter not provided or bad | Status Bad Request (400)
202  | Missing some field | Status Bad Request (400)

## Get User Status

#### Description

Get a user's detail by its jwt.

#### Request
```json
GET /api/user/status
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "avatar_url": "http://puo7ltwok.bkt.clouddn.com/Fse4b_C0cNTmFNftBXX3T-RQPMFo",
    "id": 5,
    "jwt_token": "new_jwt",
    "jaccount": "jaccount",
    "nickname": "nickname",
    "phone": "12341825417",
    "signature": "欧哈哈哈哈哈哈哈",
    "username": "username",
    "birthday": "2001-1-1",
    "major": "软件工程",
    "gender": 0,
    "dormitory": "东15",
    "privacy": 0
}
```
Jwt is invalid - 401
```json
{
    "message": "You need login to do this"
}
```

## Get User Detail

#### Description

Get a user's detail by user id.
With different privacy level, you will get different results.

#### Request

```json
GET /api/public/detail?id=1
(optional) Authorization: Bearer jwt
```

#### Response

Status OK (Privacy Level `0`) - 200
```json
{
    "avatar_url": "http://puo7ltwok.bkt.clouddn.com/Fse4b_C0cNTmFNftBXX3T-RQPMFo",
    "id": 5,
    "nickname": "nickname",
    "phone": "12341825417",
    "signature": "欧哈哈哈哈哈哈哈",
    "birthday": "2001-1-1",
    "major": "软件工程",
    "gender": 0,
    "dormitory": "东15",
    "privacy": 0
}
```

Status OK (Privacy Level `1`) - 200
```json
{
    "avatar_url": "http://puo7ltwok.bkt.clouddn.com/Fse4b_C0cNTmFNftBXX3T-RQPMFo",
    "id": 5,
    "nickname": "nickname",
    "signature": "欧哈哈哈哈哈哈哈",
    "privacy": 1,
    "message": "Only friend can access information"
}
```

Status OK (Privacy Level `-1`) - 200
```json
{
    "avatar_url": "http://puo7ltwok.bkt.clouddn.com/Fse4b_C0cNTmFNftBXX3T-RQPMFo",
    "id": 5,
    "nickname": "nickname",
    "signature": "欧哈哈哈哈哈哈哈",
    "privacy": -1,
    "message": "The user hide its information"
}
```

Status OK (Privacy Level `1` & Friends) - 200
```json
{
    "avatar_url": "http://puo7ltwok.bkt.clouddn.com/Fse4b_C0cNTmFNftBXX3T-RQPMFo",
    "id": 5,
    "nickname": "nickname",
    "phone": "12341825417",
    "signature": "欧哈哈哈哈哈哈哈",
    "birthday": "2001-1-1",
    "major": "软件工程",
    "gender": 0,
    "dormitory": "东15",
    "privacy": 2
}
```

User Not Found - 400
```json
{
    "error": {
        "id": "",
        "code": 0,
        "detail": "user not found",
        "status": ""
    }
}
```

## Register

#### Description

Register a new user by username, password, phone, nickname and jwt.

#### Request
```json
POST /api/public/register
Content-Type: application/json
Authorization: Bearer jwt

{
    "username": "username",
    "password": "password",
    "nickname": "nick",
    "phone": "12345666554"
}
```

#### Response
Status OK - 200
```json
{
    "message": "Register ok"
}
```

Already Registered - 400
```json
{
    "error": {
        "id": "",
        "code": 0,
        "detail": "you've already registered",
        "status": ""
    }
}
```

## Jaccount Login

#### Description

Call Jaccount login by code and uri.

#### Request
```json
POST /api/public/register
Content-Type: application/json

{
    "code": "{code}",
    "redirect_uri": "{redirect_uri}"
}
```

#### Response

Status OK - 200

```json
{
    "message": "Get access token from Jaccount successfully",
	"access_token" : "{jwt_token}",
	"status": 200,
}
```

Miss Field - 400
```json
{
    "message": "Miss some field"
}
```

Access Token Error - 400
```json
{
    "message": "GetAccessToken Error"
}
```

## Native Login

#### Description

Login by username and password

#### Request
```json
POST /api/public/login/native
Content-Type: application/x-www-form-urlencoded

username=hello&password=hello
```

#### Response

Status OK - 200

```json
{
    "jwt_token": "jwt",
    "message": "Login success"
}
```

Bad Credential - 401
```json
{
    "message": "Bad credential"
}
```

## Wechat Login

#### Description

Login by wechat. (or bind jaccount)

#### Request
```json
POST /api/public/login/wx
Content-Type: application/json

{
    "code": "{code}"
}
```

#### Response
Status OK - 200
```json
{
    "status": 0,
    "message": "Login success",
    "jwt": "jwt",
}
```

Need binding - 301
```
returns a base64 QRcode image
```

Need update info - 200
```json
{
    "message" : "Need update user info",
    "status": 22,
    "jwt": "jwt",
}
```

Login failed - 400
```json
{
    "message": "Login failed"
}
```

## Bind Wechat & Jaccount

#### Description

Bind wechat and jaccount. (used for redirecting)

#### Request

```json
POST /api/public/wx/redirect?code={code}&jwt=jwt
```

#### Response

```
<h1>已完成绑定，重新打开微信小程序即可使用即应的强大功能</h1>
```

## Follow

#### Description

Follow someone with user_id.

#### Request
```json
GET /api/user/follow?id=1
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Follow successfully"
}
```
Follow Oneself - 400
```json
{
    "error": 1,
    "message": "Can't follow yourself"
}
```
Have Followed - 400
```json
{
    "error": 2,
    "message": "You've followed this person"
}
```

## UnFollow

#### Description

Unfollow someone with user_id.

#### Request
```json
GET /api/user/unfollow?id=1
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Unfollow successfully"
}
```

## Get Following

#### Description

Get a list of following persons.

#### Request
```json
GET /api/user/followings
Authorization: Bearer jwt
```

#### Response
```json
[
    {
        "id": 1,
        "nickname": "Nick",
        "avatar_url": "http://..",
        "signature": "Hello world"
    },
    {
        ...
    }
]
```
or `null`.

## Get Follower
#### Description

Get a list of your followers.

#### Request
```json
GET /api/user/followers
Authorization: Bearer jwt
```

#### Response
```json
[
    {
        "id": 1,
        "nickname": "Nick",
        "avatar_url": "http://..",
        "signature": "Hello world"
    },
    {
        ...
    }
]
```
or `null`.

## Get Friends

#### Description

Get a list of your friends (follow each other).

#### Request
```json
GET /api/user/friends
Authorization: Bearer jwt
```

#### Response
```json
[
    {
        "id": 1,
        "nickname": "Nick",
        "avatar_url": "http://..",
        "signature": "Hello world"
    },
    {
        ...
    }
]
```
or `null`.

## Change Privacy Level
#### Description

Change your privacy level.
`0` - Anyone can see
`1` - Only friends
`-1` - Hidden

#### Request
```json
GET /changeprivacy?level=-1
Authorization: Bearer jwt
```

#### Response
```json
{
    "message": "update successfully",
}
```

## Query Activity

#### Description

Find an activity.

#### Request

```json
GET /api/public/act/query?act_id={act_id}
```

#### Response

```json
{
    "act_id": 1,
    "comments": [
        {
            "content": "sdfsdf",
            "receiver_id": -1,
            "time": "2019-7-17 11:20",
            "title": "sebastianj",
            "user_id": 5
        },
        {
            "content": "sdfg",
            "receiver_id": -1,
            "time": "2019-7-17 11:20",
            "title": "sebastianj",
            "user_id": 5
        },
        {
            "content": " dgdfgdfg",
            "receiver_id": 5,
            "time": "2019-7-17 11:20",
            "title": "sebastianj -> sebastianj",
            "user_id": 5
        }
    ],
    "create_time": "Wed Jul 17 2019",
    "depart_time": "2019-07-17",
    "description": "dfgdfgb",
    "destination": {},
    "end_time": "2019-07-17",
    "images": null,
    "origin": {},
    "signature": "123qwehuuu",
    "sponsor_id": 5,
    "sponsor_username": "sebastianj",
    "tag": [
        "default"
    ],
    "title": "dfgdf",
    "type": "taxi"
}
```

## *Activity Pages*
For `myact`,`manageact` and `findall`, you can add param `index` and `size` to query a page. For example,`/api/public/act/findall?index=0&size=5`will find latest 5 activities.

## Find All Activity

#### Description

Find all activity.

#### Request

```json
GET /api/public/act/findall
```


#### Response

```json
[
    {
        "act_id": 1,
        ...
    },
    {
        "act_id": 2,
        ...
    },
    {
        "act_id": 3,
        ...
    },
    {
        "act_id": 4,
        ...
    },
    {
        "act_id": 5,
        ...
    }
]
```
## Find Activity by Type

#### Description
Find activities of a designate type. If the user has already logined, a jwt is needed to carry the userid and help save the user's behavior.

#### Requests
```
GET /api/public/act/findbytype?type=taxi
(Authorization: Bearer)
```

Status OK - 200
#### Response
```json
[
    {
        "act_id": 1,
        ...
        "type" : "taxi"
    },
    {
        "act_id": 3,
        ...
        "type" : "taxi"
    },
]
```

####
## My Act

#### Description

Get all acts a user joins.

#### Requests

```
GET /api/user/act/myact
Authorization: Bearer jwt
```

#### Response

Status OK - 200
```json
[
    {
        "act_id": 1,
        "comments": [
            {
                "content": "sdfsdf",
                "receiver_id": -1,
                "time": "2019-7-17 11:20",
                "title": "sebastianj",
                "user_id": 5
            },
            {
                "content": "sdfg",
                "receiver_id": -1,
                "time": "2019-7-17 11:20",
                "title": "sebastianj",
                "user_id": 5
            },
            {
                "content": " dgdfgdfg",
                "receiver_id": 5,
                "time": "2019-7-17 11:20",
                "title": "sebastianj -> sebastianj",
                "user_id": 5
            },
            {
                "content": "添加评论",
                "receiver_id": -1,
                "time": "2019-7-17 15:19",
                "title": "nm$l",
                "user_id": 11
            },
            {
                "content": "添加another评论",
                "receiver_id": -1,
                "time": "2019-7-17 15:19",
                "title": "nm$l",
                "user_id": 11
            }
        ],
        "create_time": "Wed Jul 17 2019",
        "depart_time": "2019-07-17",
        "description": "dfgdfgb",
        "destination": {},
        "end_time": "2019-07-17",
        "images": null,
        "origin": {},
        "signature": "123qwehuuu",
        "sponsor_id": 5,
        "sponsor_username": "sebastianj",
        "tag": [
            "default"
        ],
        "title": "dfgdf",
        "type": "taxi"
    }
]
```

## Managing Act

#### Description

Get all acts a user manages.

#### Requests

```
GET /api/user/act/manageact
Authorization: Bearer jwt
```

#### Response

Status OK - 200
```json
[
    {
        "act_id": 6,
        "comments": [],
        "create_time": "2019-7-15 15:17",
        "depart_time": "2019-7-16 15:17",
        "description": "desc",
        "destination": {},
        "end_time": "2019-7-17 15:17",
        "images": null,
        "origin": {},
        "signature": "",
        "sponsor_id": 6,
        "sponsor_username": "孙笑川",
        "tag": [
            "g",
            "a",
            "t"
        ],
        "title": "title",
        "type": "taxi"
    }
]
```

## Publish Activity

#### Description

Publish an activity, its type can be taxi, takeout, order and other.

#### Requests

```json
POST /api/user/act/publish
Authorization: Bearer jwt

{
    "type": "taxi", 
    "create_time": "2019-7-15 15:17",
    "end_time": "2019-7-17 15:17",
    "title": "title",
    "description": "desc",
    "tag": ["t", "a", "g"],
    "images": [],
    "max_member" : 4,

    "depart_time": "2019-7-16 15:17",
    "origin": {},
    "destination": {},

    "order_time": "2019-7-16 15:17",
    "store": "store",

    "store": "store",

    "activity_time": "2019-7-16 15:17"
}
```

#### Response
Status OK - 200
```json
{
    "message": "Publish successfully"
}
```
Need Login - 401
```json
{
    "message": "you need login to do this"
}
```

## Modify Activity

#### Description

Modify an activity, but can't modify title and type.

#### Requests

```json
POST /api/user/act/modify
Authorization: Bearer jwt

{
    "act_id": 6,
    "type": "taxi",
    "create_time": "2019-7-15 15:17",
    "end_time": "2019-7-17 15:17",
    "description": "desc",
    "tag": ["g", "a", "t"],
    "images": [],

    "depart_time": "2019-7-16 15:17",
    "origin": {},
    "destination": {},

    "order_time": "2019-7-16 15:17",
    "store": "store",

    "store": "store",

    "activity_time": "2019-7-16 15:17"
}
```

#### Response
Status OK - 200
```json
{
    "message": "Modify successfully"
}
```
Need Login - 401
```json
{
    "message": "you need login to do this"
}
```
Forbidden - 403
```json
{
    "message": "403 Forbidden"
}
```

## Delete Activity

#### Description

Delete an activity.

#### Request
```json
POST /api/user/act/delete?act_id={act_id}
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Delete successfully"
}
```
Need Login - 401
```json
{
    "message": "you need login to do this"
}
```
Forbidden - 403
```json
{
    "message": "403 Forbidden"
}
```

## Comment

#### Description

Send a comment under an activity.

#### Request

```json
POST /api/user/act/comment
Authorization: Bearer jwt

{
    "receiver_id": 1,
    "content": "content",
    "act_id": 1,
    "time": "2018-07-05 13:01"
}
```

#### Response
Status OK - 200
```json
{
    "message": "Comment successfully"
}
```
Need Login - 401
```json
{
    "message": "you need login to do this"
}
```

## Join Activity

#### Description

Join an act.

#### Request
```json
POST /api/user/act/join?act_id={act_id}
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Join activity successfully"
}
```

## Get Activity Applicants

Get an activity along with its applicants.

#### Request
```json
GET /api/user/act/getjoinapp
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
[
    {
        "act_id": 6,
        "applicant_id": 5,
        "comments": [],
        "create_time": "2019-7-15 15:17",
        "depart_time": "2019-7-16 15:17",
        "description": "desc",
        "destination": {},
        "end_time": "2019-7-17 15:17",
        "images": null,
        "origin": {},
        "signature": "",
        "sponsor_id": 6,
        "sponsor_username": "孙笑川",
        "tag": [
            "g",
            "a",
            "t"
        ],
        "title": "title",
        "type": "taxi"
    }
]
```

## Accept Applicants

#### Description

Accept an application.

#### Request
Accept the application of the designated user to the designated activity.
```json
POST /api/user/act/acceptjoin?act_id={act_id}&user_id={user_id}
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Accept successfully"
}
```

## Get Status

#### Description

Get an activity status to a user. -1: need acception, 0: joined, 1: admin, -2: not joined

#### Request
```
GET /api/user/act/status?act_id=7
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```
{
    "status": -2
}
```

## Update User Info

#### Description

Update a user's information. If phone, signature, nickname is not provided, these field will not update.

#### Request

```json
POST /api/user/info/update
Authorization: Bearer jwt

{
    "id": 1,
    "phone": "15224536843",
    "signature": "fdsagasd",
    "nickname": "nick"
}
```

#### Response 
Status OK - 200
```json
{
    "message" : "Update ok",
}
```

## Upload Avatar

#### Description

Upload a user's avatar.

#### Request 

```
POST /api/user/avatar/upload
Authorization: Bearer jwt

base64
```

#### Response

```json
{
    "message": "Upload avatar successfully",
    "url": "http://...."
}
```

## Tag Management
### Recommend tags
#### Description
Generate recommmended tags refering to the title and description of the very activity. 
#### Request
``` json
POST /api/user/act/gettag
Authorization: Bearer jwt

{
    "title":"活动的标题",
    "description":"活动的描述"
}
```
SSS
#### Response
Status OK - 200
``` json
{
    "tags":["标签1","标签2"]
}
```

### Add candidate tags
#### Description
When a user inputs a custom-defined tag, add it into candidate tags. If 2 different users append a same tag into candidate tag list, remove the tag from the candidate list and add it to the formal tag dictionary.
#### Request
``` json
POST /api/user/act/addtag
Authorization: Bearer jwt

{
    "tags":["新标签1","新标签2"]
}
```

#### Response
Return the number of tags that are added into the candidate list or formal tag dictionary successfully. If a tag is already in the formal tag dictionary, the addition is expected to fail consequentlyS.

``` json
{
    "num":1
}
```

## Recommandation
### Record user's behavior
#### Description
When a user interact with the application, his/her behaviors are expected to be sent to the database and stored there, which can be used to construct his/her personal portrait.
</br>
The type can be "taxi","takeout","order","other", and the behavior can be "search","scanning","join","publish"
#### Request
``` json
POST /api/user/act/addbehavior
Authorization:Bearer jwt

{
	"type":"taxi",
	"behavior":"scanning"
}
```

#### Response
Status OK-200

```json
{
    "message": "Add behavior succeed"
}
```

### Recommend Activities

#### Description
Recommand activity for a logined user.

#### Request
``` json
GET /api/user/act/recommendact
Authorization: Bearer jwt
```

#### Response
```` json
[
    {
        "act_id": 1,
        "activity_time": "2022-11-11 11:11:21",
        "comments": [],
        "create_time": "2022-10-5",
        "description": "description",
        "end_time": "2022-12-6",
        "images": null,
        "signature": "simimasai",
        "sponsor_id": 3,
        "sponsor_username": "孙笑川",
        "tag": [
            "Basketball"
        ],
        "title": "Basketball this afternoon",
        "type": "other"
    },
    {
        "act_id": 2,
        ...
    }
]
````


### Search Takeout Shops

#### Description
Search a shop by name.

#### Request
``` json
GET api/public/takeout/searchshop?key=鱼
```

#### Response
```` json
[
    {
        "id": "E2232915932469195332",
        "name": "鱼你在一起(吴泾宝龙广场店)"
    },
    {
        "id": "E14984431780752757484",
        "name": "晨曦炖品·鲍鱼饭(吴泾店)"
    },
    {
        "id": "E18379350634051443412",
        "name": "蜀风麻辣鱼-烤鱼-烤鸡-炸鸡"
    },
    {
        "id": "E3086685298986339899",
        "name": "无骨烤鱼饭&牛蛙饭"
    },
    {
        "id": "E5149393426759582031",
        "name": "陈小碗等一人烤鱼饭(闵行店)"
    },
    {
        "id": "E868837318594021566",
        "name": "林葱烤鱼饭(上海交大店)"
    },
    {
        "id": "E1290644095784343101",
        "name": "酸菜鱼"
    },
    {
        "id": "E18168908440994869408",
        "name": "鲜牛火锅|烤鱼牛蛙|不甘平淡(永平南路店)"
    },
    {
        "id": "E7993081741303640907",
        "name": "小金鱼麻辣香锅(灯辉支路店)"
    },
    {
        "id": "E4092211391740264883",
        "name": "芳小姐水煮鱼(万乐城店)"
    },
    {
        "id": "E4112325855160229761",
        "name": "辉哥酸菜鱼黄焖鸡米 饭"
    },
    {
        "id": "E18255317800802630288",
        "name": "鱼酷活力烤鱼(碧江广场店)"
    }
]
````

## Ban User

#### Description
Ban a user by user_id and timestamp(accurate to ms)
PS: You can use `Time.prototype.getTime()` in JavaScript to get timestamp.

#### Request
``` json
GET api/admin/banuser?id=1&time=1564368642393
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Ban user successfully"
}
```

## Delete Activity (Admin)

#### Description

Delete an activity.

#### Request
```json
POST /api/admin/act/delete?act_id={act_id}
Authorization: Bearer jwt
```

#### Response
Status OK - 200
```json
{
    "message": "Delete successfully"
}