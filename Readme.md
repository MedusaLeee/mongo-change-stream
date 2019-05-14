## 启动
```
docker-compose up -d
```
## 步骤

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
    rs.add('m-slave:27017')
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
    db.testdb.insert({"name": "tom", "age": 30});
    db.testdb.find({});
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
    db.testdb.find(); // 会发现将插入的数据同步过来了
    ```

还有点问题，每次进入都需要 `rs.slaveOk()` 下，测试集群先不处理了。
