---
title: 高性能MySQL
tags:
  - MySQL
date: 2024-10-28 19:56:33
categories: 笔记
---

# MySQL的存储引擎

## InnoDB

- 支持事务：提供了具有提交、回滚和崩溃恢复能力的事务安全，确保数据的一致性和完整性。
- 行级锁定：可以在操作数据行时进行锁定，提高并发性能，减少锁冲突。
- 外键约束：支持外键约束，保证数据的参照完整性。
- 缓冲池：拥有较大的缓冲池，用于缓存数据和索引，提高数据访问速度。

## MyISAM

- 不支持事务：不提供事务处理功能，但在某些情况下，这可以提高性能和减少存储需求。
- 表级锁定：采用表级锁定机制，在写入操作时会锁定整个表，导致并发性能相对较低。
- 高速插入和查询：对于大量数据的插入和查询操作速度较快。
- 占用空间小：存储数据的方式较为紧凑，占用的磁盘空间相对较少。

# MySQL执行计划分析

- id 子查询的执行顺序
- select_type
- table 表名，别名
- partitions
- **type** ALL全表数据，index遍历索引，range索引范围，const一条记录
- possible_keys 可能用到的索引
- **key** 使用的索引
- key_length 使用的索引长度
- ref 连接匹配条件
- rows 扫描行数
- **extra**

额外信息

- `using filesort`
- `using temporary`
- `using index`
- `using where`
- `distinct`

# 索引

## InnoDB为什么使用B+树作为索引

- 二叉树 不平衡
- 红黑树 高度太高
- 哈希表 有哈希冲突，仅能满足`=`，`IN`，不支持范围查询
- B树 存储同样元素，高度小，效率高
- B+树 叶子节点有序，连接起来

## 聚簇索引与非聚簇索引

`MyISAM`在data目录下会看到3类文件：`.frm、.myi、.myd`，索引和数据是分开存储的，是非聚集索引。

1. .frm，表定义，是描述表结构的文件
2. .myd，D表示数据信息文件，是表的数据文件
3. .myi，I表示索引信息文件，是表数据文件中任何索引的数据树

`InnoDB`在data目录下会看到2类文件：`.frm、.ibd`，索引和数据是存储在一个文件，是聚集索引。

1. *.frm，表结构的文件。*
2. .ibd，表数据和索引的文件。该表的索引(B+树)的每个非叶子节点存储索引，叶子节点存储索引和索引对应的数据

## 联合索引

最左匹配原则，效率高，后面索引在索引树中没有任何顺序。

# MySQL日志

MySQL日志主要包括错误日志、查询日志、慢查询日志、事务日志、二进制日志几大类。

MySQL数据库的**数据备份、主备、主主、主从**都离不开binlog，记录内容是语句的原始逻辑，类似于“给id=2这一行的name字段加 1”，属于`MySQL Server`层，依靠 binlog 来同步数据，保证数据一致性。

MySQL的InnoDB引擎使用 **redo log(重做日志)** 保证事务的**持久性**，使用**undo log(回滚日志)**来保证事务的**原子性，**拥有崩溃恢复能力。

# MVCC原理

> RC（Read Commit）读已提交，RR（Repeatable Read）可重复读

![MVCC](https://zhaowuya.s3.bitiful.net/mvcc.jpg)

## 三大利剑

隐藏字段，UndoLog版本链，ReadView读视图。

在每一条数据后，都有三个隐藏字段，其中较重要的是事务ID`db_trx_id`和回滚指针`db_roll_ptr`，还有一个隐式主键`db_row_id`字段在没有显示指定主键时起作用。

每当事务对数据进行修改后，会在UndoLog中生成日志，将老数据记录下来，并使用新数据的回滚指针指向老数据的地址，经过几次修改后，就会形成一个UndoLog版本链。

每当事务执行SQL语句时，会得到一个ReadView，用来做可见性判断，判断当前事务是否能看见此版本的数据。ReadView维护了4个字段，`trx_list`，`up_limit_id`，`low_limit_id`，`creator_trx_id`。

## 读操作

1. 快照读（Snapshot Read），读取的是历史版本的数据，是不加锁的普通读操作。
2. 当前读（Current Read），读取的是最新版本的数据，并加锁保证数据的一致性和事务隔离。

## 工作流程

1. 如果事务ID小于ReadView中的最小值`low_limit_id`，说明该事务在ReadView之前已提交，可以读到。
2. 如果事务ID大于等于`low_limit_id`，如果大于等于则代表DB_TRX_ID 所在的记录在Read View生成后才出现的，那对当前事务肯定不可见，如果小于则进入下一个判断。
3. 如果事务ID在活跃事务列表`trx_list`中，当前事务看不见；如果不在，说明这个事务在ReadView生成之前就已经提交了，当前事务还能看见。

## MVCC解决幻读

解决了部分场景下的幻读，下表所示的情况就没有解决。

| `BEGIN`                                          |                                            |
| ------------------------------------------------ | ------------------------------------------ |
| `SELECT * FROM emp WHERE no = 4`                 | **`BEGIN`**                                |
|                                                  | `INSERT INTO emp VALUES (4, '李四', 4200)` |
| `UPDATE emp SET ename = '李五' WHERE emp_no = 4` |                                            |
| `SELECT * FROM emp WHERE no = 4`                 |                                            |
