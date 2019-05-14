# mongodb change stream test

要求mongodb 3.6以上，必须replica sets 或者sharded cluster部署方式，必须使用WiredTiger 引擎

## mongodb version

4.0.9

## 启动副本集docker集群
```
docker-compose up -d
```
## 副本集配置

1. 进入master节点
    ```
    docker exec -it m-master mongo
    ```
2. 初始化副本集
    ```
    rs.initiate()
    ```
3. 将slave节点加入副本集
    ```
    rs.add('10.8.201.228:27018')
    ```
4. 查看副本集配置
    ```
    rs.conf()
    ```
5. 查看副本集状态
    ```
    rs.status()
    ```
6. 验证副本集可用性
    ```
    use testdb;
    db.user.insert({"name": "tom", "age": 30});
    db.user.find({});
    ```
7. 进入slave节点验证可用性
    ```
    docker exec -it m-slave mongo
    
    show dbs;
    ```
    会报错，执行
    ```
    rs.slaveOk()
    show dbs;  // 会发现正常
    db.user.find(); // 会发现将插入的数据同步过来了
    ```
8. 在宿主机用mongoose连接还会报错，修改如下：
    ```
        rs1:PRIMARY> rs.config()
        {
                "_id" : "rs1",
                "version" : 2,
                "protocolVersion" : NumberLong(1),
                "writeConcernMajorityJournalDefault" : true,
                "members" : [
                        {
                                "_id" : 0,
                                "host" : "85a57ff3a3b0:27017",
                                "arbiterOnly" : false,
                                "buildIndexes" : true,
                                "hidden" : false,
                                "priority" : 1,
                                "tags" : {
                                        
                                },
                                "slaveDelay" : NumberLong(0),
                                "votes" : 1
                        },
                        {
                                "_id" : 1,
                                "host" : "10.8.201.228:27018",
                                "arbiterOnly" : false,
                                "buildIndexes" : true,
                                "hidden" : false,
                                "priority" : 1,
                                "tags" : {
                                        
                                },
                                "slaveDelay" : NumberLong(0),
                                "votes" : 1
                        }
                ],
                "settings" : {
                        "chainingAllowed" : true,
                        "heartbeatIntervalMillis" : 2000,
                        "heartbeatTimeoutSecs" : 10,
                        "electionTimeoutMillis" : 10000,
                        "catchUpTimeoutMillis" : -1,
                        "catchUpTakeoverDelayMillis" : 30000,
                        "getLastErrorModes" : {
                                
                        },
                        "getLastErrorDefaults" : {
                                "w" : 1,
                                "wtimeout" : 0
                        },
                        "replicaSetId" : ObjectId("5cda9bfda763d6f5cec0d28d")
                }
        }
        rs1:PRIMARY> var config=rs.config()
        rs1:PRIMARY> config.members[0].host="10.8.201.228:27017"
        10.8.201.228:27017
        rs1:PRIMARY> rs.reconfig(config)
    ```


还有点问题，每次进入都需要 `rs.slaveOk()` 下，测试集群先不处理了。

## 测试

```
    npm install
    node index.js
```

输出

```
// 创建
stream:  { _id:
   { _data:
      '825CDAA00B000000012B022C0100296E5A10042BEBA33F87004F1AB1F156B5B66E428946645F696400645CDAA00B54B832C842F9ED580004' },
  operationType: 'insert',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 1, high_: 1557831691 },
  fullDocument:
   { _id: 5cdaa00b54b832c842f9ed58, age: 30, name: 'tom1', __v: 0 },
  ns: { db: 'testdb', coll: 'user' },
  documentKey: { _id: 5cdaa00b54b832c842f9ed58 } }
// 更新
stream:  { _id:
   { _data:
      '825CDAA00B000000022B022C0100296E5A10042BEBA33F87004F1AB1F156B5B66E428946645F696400645CDAA00B54B832C842F9ED580004' },
  operationType: 'update',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 2, high_: 1557831691 },
  ns: { db: 'testdb', coll: 'user' },
  documentKey: { _id: 5cdaa00b54b832c842f9ed58 },
  updateDescription: { updatedFields: { age: 31 }, removedFields: [] } }
// 删除
stream:  { _id:
   { _data:
      '825CDAA00B000000032B022C0100296E5A10042BEBA33F87004F1AB1F156B5B66E428946645F696400645CDAA00B54B832C842F9ED580004' },
  operationType: 'delete',
  clusterTime:
   Timestamp { _bsontype: 'Timestamp', low_: 3, high_: 1557831691 },
  ns: { db: 'testdb', coll: 'user' },
  documentKey: { _id: 5cdaa00b54b832c842f9ed58 } }

```
