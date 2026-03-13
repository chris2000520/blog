---
title: 遗传算法
tags:
  - 算法
date: 2022-10-19 20:29:05
categories: 笔记
---

# 遗传算法（Genetic Algorithm）

## 1.是什么？怎么来的？

上次我们说到人们从大自然中学习到了许多问题的解决方法，这一次的遗传算法也不例外。生物在自然界中的生存繁衍，显示出了其对自然环境的自适应能力。遗传算法(Genetic Algorithm，简称GA)就是这种生物行为的计算机模拟中令人瞩目的重要成果。基于对生物遗传和进化过程的计算机模拟，遗传算法使得各种人工系统具有优良的自适应能力和优化能力。

**遗传算法所借鉴的生物学基础就是生物的遗传和进化。**

相关术语：

| 术语   | 英文         |
| ------ | ------------ |
| 种群   | population   |
| 变异   | mutation     |
| 个体   | individual   |
| 交叉   | crossover    |
| 选择   | selection    |
| 繁殖   | reproduction |
| 代     | generation   |
| 适应度 | fitness      |
| 编码   | coding       |
| 解码   | decoding     |

我们知道，求最优解或近似最优解的方法主要有三种：

枚举法、启发式算法和随机搜索算法。

随着问题种类的不同，以及问题规模的扩大，要寻求到一种能以有限的代价来解决上述最优化问题的通用方法仍是个难题。而遗传算法却为我们解决这类问题提供了一个有效的途径和通用框架，开创了一种新的全局优化搜索算法。

## 2.怎么做？

文字描述，在初始种群中，不断选择个体，将其交叉，变异后依概率选择出适应度最高的个体，并产生新的一代种群。最后不断优化，收敛于最优解附近。

伪代码描述

```c
编码
初始化种群
计算种群的适应度和累积概率
while iter < itermax:
	复制 //剔除适应度低的，将适应度好的复制一份
	交叉 //二进制数字位数交换
	变异 //二进制位数取否
	重新计算适应度和累积概率
	end
解码输出结果
```

### 2.1 编码

编码的主要方式有二进制码，也是最常用的。在这一阶段是将一个变量或多个变量，根据其约束的定义域以及我们要得到的自变量的精度，选择合适的二进制位数将问题编码。

在随机初始化种群过程中，我们也必须考虑群体的数量是多少，即一个种群是由多少个个体组成的。



> 当个体数量取值较小时，可提高遗传算法的运算速度，但搜索空间分布范围有限，降低了群体的多样性，有可能会引起 遗传算法的早熟现象;
> 当个体数量取值较大时，一方面计算复杂，会使遗传算法的运行效率降低，另一方面，部分高适应值的个体可能被淘汰， 影响交叉。
> 初始种群的一般取值范围是20~100。





### 2.2 评价个体适应度

当为单目标优化问题时，适应度就是该点时的函数值。

### 2.3 选择

可以根据*轮盘赌法*，计算每一个个体的累积概率。就像一个圆盘上被划分成了不同大小的区域块，面积大的我们选择的几率肯定就高。在计算机中，我们把圆盘模拟成0到1的线段，把线段分为不同大小的小线段，我们可以通过让计算机产生一个0到1的随机数来模拟指针转动过程，落在那个区间里，我们就选择那个相对应的个体。比如在一个种群中，选择概率等于**适应度/总适应度**，累积概率等于上一个个体的累积概率加上自身的选择概率。

| 编号 | 适应度 | 选择概率 | 累积概率 |
| ---- | ------ | -------- | -------- |
| 1    | 8      | 0.333    | 0.333    |
| 2    | 1      | 0.042    | 0.375    |
| 3    | 3      | 0.125    | 0.5      |
| 4    | 12     | 0.5      | 0.5      |

### 2.4 交叉

最常用和最基本的是单点交叉算子。

1. 对群体中的个体进行两两随机配对。若群体大小为M，则共有 [ M/2 ]对相互配对的个体组
2.  每一对相互配对的个体，随机设置某一基因座之后的位置为交叉点。若染色体的长度为l ，则共有(l-1)个可能的交叉点位置
3. 对每一对相互配对的个体，依设定的交叉概率pc在其交叉点处相互交换两个个体的部分染色体，从而产生出两个新的个体

```bash
 单点交叉运算的示例如下所示:
 A：10110111 00          A1：10110111 11
 B：00011100 11          B1：00011100 00
```

### 2.5 变异

变异是针对个体的某一个或某一些基因座上的基因值执行的，因此变异概率pm也是针对基因而言，通常来说，这个概率非常小。在二进制编码中，简单来说就是随机将某一位基因位取反。



## 3.代码

解决01背包问题：

```java

import java.util.*;

public class GA {
    static final int[] w = {2, 3, 5, 1, 4};//物品重量,最大装载量等于10
    static final int[] v = {2, 5, 8, 3, 6};//物品价格
    static final int beginsum = 100; //初始种群中个体数量

    public static void main(String[] args) {

        List<String> beginlist = new ArrayList<>();
        List<String> list = new ArrayList<>();
        for (int i = 0; i < beginsum; i++) {
            String s = randomlist();
            beginlist.add(s);

        }

        System.out.println(beginlist);
        int iter = 0;
        while (iter < 1000) {

            Iterator<String> iterator = beginlist.iterator();
            while (iterator.hasNext()) {
                String str = iterator.next();
                if (!isLegal(str)) {
                    iterator.remove();
                }
            }


            int len = beginlist.size();


            double fitsum = 0;
            double[] cp = new double[beginsum];//累积概率cp
            int[] select = new int[beginsum];
            for (int i = 0; i < len; i++) {
                fitsum = fitsum + fitness(beginlist.get(i)); //求适应度之和fitsum
            }


            for (int i = 0; i < len; i++) {
                if (i == 0) {
                    cp[i] = fitness(beginlist.get(i)) / fitsum;
                } else {
                    cp[i] = cp[i - 1] + fitness(beginlist.get(i)) / fitsum; //求累积概率
                }

            }


            //筛选
            for (int i = 0; i < beginsum; i++) {
                    double random = Math.random();
                    int j = 0;
                    while (cp[j] < random) {
                        j++;
                    }
                    select[j]++; //选择次数
            }
            for (int i = 0; i < beginsum; i++) {
                Random r = new Random();
                int random = r.nextInt(beginsum);
                while (select[random] == 0) {
                    random = r.nextInt(beginsum);
                }
                list.add(beginlist.get(random));//选择优秀个体
                select[random]--;
            }


            //交叉
            //随机配对
            boolean[] cross = new boolean[beginsum];
            int[][] arr = new int[beginsum/2][2];//配对数组
            for (int i = 0; i < beginsum/2; i++) {
                for (int j = 0; j < 2; j++) {
                    Random r = new Random();
                    int random = r.nextInt(beginsum);
                    while (cross[random] == true) {
                        random = r.nextInt(beginsum);
                    }
                    cross[random] = true;
                    arr[i][j] = random;
                }

            }

            //交换基因片段
            for (int i = 0; i < 5; i++) {
                Random r = new Random();
                String str, str1;
                int random = r.nextInt(5);//随机设置交叉点位置
                str = list.get(arr[i][0]);
                str1 = list.get(arr[i][1]);
                String strsub = str.substring(0, random),
                        strsub1 = str.substring(random),
                        str1sub = str1.substring(0, random),
                        str1sub1 = str1.substring(random);
                str = strsub + str1sub1;
                str1 = str1sub + strsub1;


                list.set(arr[i][0], str);
                list.set(arr[i][1], str1);

            }


            //变异
            if (Math.random() < 0.01) {
                Random r = new Random();
                int random = r.nextInt(beginsum);//要变异的个体下标
                int random1 = r.nextInt(5);//要变异的基因位置

                String str = list.get(random);
                int ch = ~str.charAt(random1) - '0';
                StringBuilder sb = new StringBuilder(str);
                sb.setCharAt(random1, (char) ch);
                str = sb.toString();
                list.set(random, str);

            }

            beginlist.clear();//清空list元素

            for (int i = 0; i < beginsum; i++) {
                beginlist.add(list.get(i));//赋值给beginlist
            }

            list.clear();//清空list元素

            iter++;

        }
        System.out.println(beginlist);
        System.out.println("最大可以拿总价值为" + fitness(beginlist.get(0)) + "的物品，拿法如下（序号代表拿第几个物品）：");
        System.out.println(beginlist.get(0));


    }


    /**
     * 是否合法
     *
     * @param str
     * @return
     */

    public static boolean isLegal(String str) {
        int sum = 0, num;
        for (int i = 0; i < 5; i++) {
            num = str.charAt(i) - '0';
            sum = sum + num * w[i];
        }
        if (sum > 10)
            return false;
        return true;
    }

    /**
     * 初始化个体
     *
     * @return
     */
    public static String randomlist() {
        String str = "";
        for (int i = 0; i < 5; i++) {
            int num = Math.random() > 0.5 ? 1 : 0;//随机产生1，0
            str += String.valueOf(num);
        }
        return str;
    }

    /**
     * 计算适应度
     *
     * @param n
     * @return
     */
    public static int fitness(String str) {
        int sum = 0, num;
        for (int i = 0; i < 5; i++) {
            num = str.charAt(i) - '0';
            sum = sum + num * v[i];
        }
        return sum;
    }


}

```



