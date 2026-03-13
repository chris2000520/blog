---
title: 基于Java的校园招聘系统
toc: true
tags:
  - Java
  - SQL
  - JDBC
abbrlink: b24a61b6
date: 2020-09-20 17:18:14
categories: 技术
---


# 确定设计模式

在学习之前，都没有听说过的MVC。
## MVC模式
MVC模式代表 Model-View-Controller（模型-视图-控制器） 模式。这种模式用于应用程序的分层开发。

Model（模型）：模型代表一个存取数据的对象或 JAVA POJO。它也可以带有逻辑，在数据变化时更新控制器。

View（视图）：视图代表模型包含的数据的可视化。

Controller（控制器）：控制器作用于模型和视图上。它控制数据流向模型对象，并在数据变化时更新视图。它使视图与模型分离开。

所以我们根据这个模式先创建了一个Java工程和四个包，分别是com.java.Dao，com.java.Model，com.java.Util，com.java.View。

## DAO模式

DAO(DataAccessobjects 数据存取对象)是指位于业务逻辑和持久化数据之间实现对持久化数据的访问。通俗来讲，就是将数据库操作都封装起来。因为当时是跟着做的，不知道为啥要写这个包，现在来弄明白来。

DAO接口：把对数据库的所有操作定义成抽象方法，可以提供多种实现。

DAO实现类：针对不同数据库给出DAO接口定义方法的具体实现。
实体类：用于存放与传输对象数据。

数据库连接和关闭工具类：避免了数据库连接和关闭代码的重复使用，方便修改。

# 连接数据库

```java
package com.java1234.util;

import java.sql.Connection;
import java.sql.DriverManager;


public class DbUtil {
		private String driver="com.mysql.cj.jdbc.Driver";//驱动名称
        private String url="jdbc:mysql://localhost:3306/demo?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT";
        private String user="root";//数据库用户
        private String psd="mysql1970s";//数据库密码
        
        
        public Connection getCon() throws Exception{
        	Class.forName(driver);
        	Connection con=DriverManager.getConnection(url,user,psd);
        	return con;
        }
        
        
        /*
            关闭数据库
        */
        public void closeCon(Connection con)throws Exception {
        	if(con!=null) {
        		con.close();
        	}
        }
        //Alt + / 是自动提示
        //main syso
        public static void main(String[] args) {
        	DbUtil dbUtil=new DbUtil();
        	try {
        		dbUtil.getCon();
        		System.out.println("数据库连接成功！");
        	}catch (Exception e) {
        		e.printStackTrace();
        		System.out.println("数据库连接失败！");
        	}
			
		}
	
}

```
首先我们需要将mysql-connector-java-8.0.19.jar包添加到Bulid Path里面，然后加载驱动```"com.mysql.cj.jdbc.Driver" ```。那些URL都是有固定格式的，可以上网查一下，URL那里把demo换成自己的数据库名就可以了。用完数据库后要断开连接，释放资源，直接```con.close```就可以。我们在捕获异常里写一个输出，来显示异常。

# 创建登陆窗口

我们用Eclipse里的插件[WindowBuilder](https://blog.csdn.net/xueba8/article/details/78561351)来实现图形化编程，可以说很方便了，在设计界面直接拖拽，勾选，修改，都会在源码界面直接生成代码，但是要自己写各个块的功能。
```java
private void loginActionPerfromed(ActionEvent evt) {
		String username=this.textField.getText();
		String password=new String(this.passwordField.getPassword());
		/*
		  判空事件
		 */
		if(StringUtil.isEmpty(username)) {
			JOptionPane.showMessageDialog(null,"用户名不能为空！");
		}
		if(StringUtil.isEmpty(password)) {
			JOptionPane.showMessageDialog(null, "密码不能为空！");
		}
		/*
		   登陆验证
		 */
		User user=new User(username,password);
		Connection con=null;
		try {
			con=dbUtil.getCon();
			User currentUser=userdao.login(con, user);
			if(currentUser!=null) {
				JOptionPane.showMessageDialog(null, "登陆成功！");
				
				dispose();//销毁窗口
				
				new MainFrame().setVisible(true);//诱导新窗口
				
			}else {
				JOptionPane.showMessageDialog(null, "用户名或密码错误！");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			try {
				dbUtil.closeCon(con);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
			
		
	}
```
```java
public User login(Connection con ,User user)throws Exception{
		User resultUser=null;
		String sql="select * from userlog where uname=? and upsd=?";
		PreparedStatement pstmt=con.prepareStatement(sql);
		pstmt.setString(1, user.getUsername());
		pstmt.setString(2, user.getPassword());
		ResultSet rs=pstmt.executeQuery();
		if(rs.next()) {
			resultUser=new User();
			resultUser.setId(rs.getInt("id"));
			resultUser.setUsername(rs.getString("uname"));
			resultUser.setPassword(rs.getString("upsd"));
			
		}
		return resultUser;
	}
```
登陆的逻辑就很简单直接取出两个文本框里的内容去登陆表里一个一个去比较，这里的login就是在UserDao里实现的抽象方法，登陆成功后，要跳转到新的页面，就在登陆按钮的事件里新建一个Jframe窗口，再把登陆的Jframe窗口销毁，就能做出跳转的样子了。对了，说一下PreparedStatement这个类，在数据库的操作过程中，PreparedStatement 对象是一个很不起眼但是记为重要的接口对象，它继承于Statement，并与之在两方面有所不同：

1）PreparedStatement 实例包含已编译的 SQL 语句。这就是使语句“准备好”。包含于 PreparedStatement 对象中的 SQL 语句可具有一个或多个 IN 参数。IN参数的值在 SQL 语句创建时未被指定。相反的，该语句为每个 IN 参数保留一个问号("?")作为占位符。每个问号的值必须在该语句执行之前，通过适当的setXXX 方法来提供。

2）由于 PreparedStatement 对象已预编译过，所以其执行速度要快于 Statement 对象。因此，多次执行的 SQL 语句经常创建为 PreparedStatement 对象，以提高效率。


作为 Statement 的子类，PreparedStatement 继承了 Statement 的所有功能。同时，三种方法 execute、 executeQuery 和 executeUpdate 已被更改以使之不再需要参数。这些方法的 Statement 形式（接受 SQL 语句参数的形式）不应该用于 PreparedStatement 对象。

 # 主页面的功能

 这里我们用到了JMenu，菜单有二级，三级等等，我的系统实现很简单，主页面就只有退出，添加，修改密码，查询，删除这几个功能。

 # 添加职位信息

 ```java
 private void workAddActionPerformed(ActionEvent evt) {
 			String wname=this.textField.getText();
 			String waddress=this.textField_1.getText();
 			String wpost=this.textField_2.getText();
 			if(StringUtil.isEmpty(wname)||StringUtil.isEmpty(waddress)||StringUtil.isEmpty(wpost)) {
 				JOptionPane.showMessageDialog(null, "这三个选项为必填选项！");
 			}else {
	 			WorkType workType=new WorkType(wname, waddress, wpost);
	 			Connection con=null;
	 			try {
	 				con=dbUtil.getCon();
	 				int n=workDao.add(con, workType);
	 				if(n==1) {
	 					JOptionPane.showMessageDialog(null, "成功添加一条记录！");
	 					this.resetValue();
	 				}else {
	 					JOptionPane.showMessageDialog(null, "添加记录失败！");
	 				}
	 				
	 			}catch(Exception e) {
	 				e.printStackTrace();
	 			}finally {
	 					try {
							dbUtil.closeCon(con);
						} catch (Exception e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
				}
	 		}
 		}
		// TODO Auto-generated method stub
		private void resetValue() {
			this.textField.setText(null);
			this.textField_1.setText(null);
			this.textField_2.setText(null);
		}
		private void resetValueActionPerformed(ActionEvent evt) {
        	this.resetValue();	
	}
 ```
 ```java
 public int add(Connection con,WorkType work)throws Exception{
		String sql="insert into work values(?,?,?)";
		//依次是名称，地址，岗位
		PreparedStatement pstmt=con.prepareStatement(sql);
		pstmt.setString(1, work.getWname());
		pstmt.setString(2, work.getWaddress());
		pstmt.setString(3, work.getWpost());
		return pstmt.executeUpdate();
	}
 ```
这里还是用到了DAO的设计模式，将添加操作定义为一种抽像方法，几乎就体会不到数据库的存在了。