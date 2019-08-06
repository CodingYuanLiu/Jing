def change_file1(path, mode):
    if mode == '0':
        fr = open(path, 'r', encoding='utf-8')
        s = fr.read()
        fr.close()
        if path == "./user/user.go":
            s = s.replace('\t\tmicro.Address(":8080"),', '\t\tmicro.Address("127.0.0.1:10080"),')
        elif path == "./login/login.go":
            s = s.replace('\t\tmicro.Address(":8080"),', '\t\tmicro.Address("127.0.0.1:10090"),')
        elif path == "./feedback/main.go":
            s = s.replace('\t\tmicro.Address(":8080"),', '\t\tmicro.Address("127.0.0.1:10190"),')
        else:
            s = s.replace('\t\tmicro.Address(":8080"),', '\t\tmicro.Address("127.0.0.1:10180"),')
        s = s.replace('k8s.NewService(', 'micro.NewService(')
        s = s.replace('\tk8s "github.com/micro/kubernetes/go/micro"', '\t//k8s "github.com/micro/kubernetes/go/micro"')
        fw = open(path, 'w', encoding='utf-8')
        fw.write(s)
        fw.close()
    else:
        fr = open(path, 'r', encoding='utf-8')
        s = fr.read()
        fr.close()
        if path == "./user/user.go":
            s = s.replace('\t\tmicro.Address("127.0.0.1:10080"),','\t\tmicro.Address(":8080"),')
        elif path == "./login/login.go":
            s = s.replace('\t\tmicro.Address("127.0.0.1:10090"),','\t\tmicro.Address(":8080"),')
        elif path == "./feedback/main.go":
            s = s.replace('\t\tmicro.Address("127.0.0.1:10190"),','\t\tmicro.Address(":8080"),')
        else:
            s = s.replace('\t\tmicro.Address("127.0.0.1:10180"),','\t\tmicro.Address(":8080"),')
        s = s.replace('micro.NewService(', 'k8s.NewService(')
        s = s.replace('\t//k8s "github.com/micro/kubernetes/go/micro"', '\tk8s "github.com/micro/kubernetes/go/micro"')
        fw = open(path, 'w', encoding='utf-8')
        fw.write(s)
        fw.close()


def change_file2(path, mode):
    if mode == '0':
        fr = open(path, 'r', encoding='utf-8')
        s = fr.read()
        fr.close()
        s = s.replace('\tos.Setenv("MICRO_REGISTRY", "kubernetes")\n\tclient.DefaultClient = grpc.NewClient(\n\t\tclient.Registry(kubernetes.NewRegistry()),\n\t)',
                      '\t/*os.Setenv("MICRO_REGISTRY", "kubernetes")\n\tclient.DefaultClient = grpc.NewClient(\n\t\tclient.Registry(kubernetes.NewRegistry()),\n\t)*/')
        s = s.replace('\t"github.com/micro/go-micro/client/grpc"', '\t//"github.com/micro/go-micro/client/grpc"')
        s = s.replace('\t"github.com/micro/go-plugins/registry/kubernetes"', '\t//"github.com/micro/go-plugins/registry/kubernetes"')
        s = s.replace('\t"os"', '\t//"os"')
        fw = open(path, 'w', encoding='utf-8')
        fw.write(s)
        fw.close()
    else:
        fr = open(path, 'r', encoding='utf-8')
        s = fr.read()
        fr.close()
        s = s.replace(
            '\t/*os.Setenv("MICRO_REGISTRY", "kubernetes")\n\tclient.DefaultClient = grpc.NewClient(\n\t\tclient.Registry(kubernetes.NewRegistry()),\n\t)*/',
            '\tos.Setenv("MICRO_REGISTRY", "kubernetes")\n\tclient.DefaultClient = grpc.NewClient(\n\t\tclient.Registry(kubernetes.NewRegistry()),\n\t)')
        s = s.replace('//"github.com/micro/go-micro/client/grpc"','"github.com/micro/go-micro/client/grpc"')
        s = s.replace('//"github.com/micro/go-plugins/registry/kubernetes"',
                      '"github.com/micro/go-plugins/registry/kubernetes"')
        s = s.replace('//"os"', '"os"')
        fw = open(path, 'w', encoding='utf-8')
        fw.write(s)
        fw.close()


mode = input("Change mode to development(0) or production(1): ")
if mode != '0' and mode != '1':
    print("Mode should be 1 or 0. Aborted.")
    exit(-1)
paths = ['./user/user.go', './login/login.go', './activity/main.go','./feedback/main.go']
paths2 = ['./api-gateway/cli/activity/activity.go', './api-gateway/cli/login/login.go', './api-gateway/cli/user/user.go','./api-gateway/cli/feedback/feedback.go']
for p in paths:
    change_file1(p, mode)
for p in paths2:
    change_file2(p, mode)
if mode == '0':
    fr = open('./dao/user.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\t//db, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")',
                  '\tdb, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")')
    s = s.replace('\tdb, err = gorm.Open("mysql", "jing:jing@tcp(mysql.database:3306)/jing")',
                  '\t//db, err = gorm.Open("mysql", "jing:jing@tcp(mysql.database:3306)/jing")')
    fw = open('./dao/user.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()
    fr = open('./dao/activity.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tsession, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")',
                  '\t//session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")')
    s = s.replace('\t//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")',
                  '\tsession, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")')
    fw = open('./dao/activity.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./dao/feedback.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tsession, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")',
                  '\t//session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")')
    s = s.replace('\t//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")',
                  '\tsession, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")')
    fw = open('./dao/feedback.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./api-gateway/main.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tk8s "github.com/micro/kubernetes/go/web"', '\t//k8s "github.com/micro/kubernetes/go/web"')
    s = s.replace('k8s.NewService(', 'web.NewService(')
    fw = open('./api-gateway/main.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()
    
    fr = open('./activity/handler/tags.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tx:=gojieba.NewJieba("/home/app/dict/jieba.dict.utf8","/home/app/dict/hmm_model.utf8","/home/app/dict/user.dict.utf8","/home/app/dict/idf.utf8","/home/app/dict/stop_words.utf8")',
                  '\tx:=gojieba.NewJieba()')
    fw = open('./activity/handler/tags.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./dao/redis.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tconn, err = redis.Dial("tcp", "redis.database:6379")',
                  '\tconn, err = redis.Dial("tcp", "localhost:6379")')
    fw = open('./dao/redis.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()
else:
    fr = open('./dao/user.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tdb, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")',
                  '\t//db, err = gorm.Open("mysql", "jing:jing@tcp(localhost:3306)/jing")')
    s = s.replace('\t//db, err = gorm.Open("mysql", "jing:jing@tcp(mysql.database:3306)/jing")',
                  '\tdb, err = gorm.Open("mysql", "jing:jing@tcp(mysql.database:3306)/jing")')
    fw = open('./dao/user.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()
    fr = open('./dao/activity.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\t//session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")',
                  '\tsession, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")')
    s = s.replace('\tsession, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")',
                  '\t//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")')
    fw = open('./dao/activity.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./dao/feedback.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\t//session, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")',
                  '\tsession, err := mgo.Dial("mongodb://jing:jing@10.107.149.143:27017/Jing")')
    s = s.replace('\tsession, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")',
                  '\t//session, err := mgo.Dial("mongodb://jing:jing@localhost:27017/Jing")')
    fw = open('./dao/feedback.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./api-gateway/main.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\t//k8s "github.com/micro/kubernetes/go/web"', '\tk8s "github.com/micro/kubernetes/go/web"')
    s = s.replace('web.NewService(', 'k8s.NewService(')
    fw = open('./api-gateway/main.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./activity/handler/tags.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tx:=gojieba.NewJieba()',
        '\tx:=gojieba.NewJieba("/home/app/dict/jieba.dict.utf8","/home/app/dict/hmm_model.utf8","/home/app/dict/user.dict.utf8","/home/app/dict/idf.utf8","/home/app/dict/stop_words.utf8")')
    fw = open('./activity/handler/tags.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()

    fr = open('./dao/redis.go', 'r', encoding='utf-8')
    s = fr.read()
    fr.close()
    s = s.replace('\tconn, err = redis.Dial("tcp", "localhost:6379")',
        '\tconn, err = redis.Dial("tcp", "redis.database:6379")')
    fw = open('./dao/redis.go', 'w', encoding='utf-8')
    fw.write(s)
    fw.close()