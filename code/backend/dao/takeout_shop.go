package dao


type Takeoutshop struct {
	ID 			int 				`gorm:"primary_key;auto_increment"`
	Sid			string
	Name		string
}

func SearchShop(key string) (shops []Takeoutshop) {
	db.Where("name LIKE ?", "%" + key +"%").Find(&shops)
	return
}