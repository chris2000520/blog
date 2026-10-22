---
title: Matt Pocock Skills
tags:
  - AI
  - 工作流
  - Matt Skills
date: 2026-10-23 00:03:00
categories: 笔记
---
# Matt Pocock Skills

![Skill](https://zhaowuya.s3.bitiful.net/skill-repo-light_2x.png?no-wait=on)

> 以前使用AI的时候，总以为只是一个提示编辑器以及简单的搜索引擎，直到Claude Code出现，我敢于放手让他干一些纯力气活了，到现在AI越来越强大，强大到我无法控制它的输出，你可能想要一个汽车，他给你造了带4个轮子的坦克，我必须想一个法子驯服他......




首先把大模型想成一个极其聪明的实习生（智商可能比你高好几倍），但他有三个改不掉的毛病：

- **爱脑补**：你没交代清楚的，他不会来问你，自己编一个版本就开干，还编得有鼻子有眼。
- **爱偷懒**：能跳的步骤就跳，测试不写、异常不管，还给自己编理由。
- **爱忘事**：活干到一半，最初的需求和一路上的反馈，全忘了。

这三个毛病改不掉，但可以管得住。

## Spec-driven：规范驱动开发

治这三个毛病的总思路，叫**spec-driven development**——规格驱动开发。一句话：先签合同，再开工。

这份"合同"至少写三件事：

1. **做什么**——包括明确不做什么
2. **为什么**——AI 知道了动机，在你没写到的细节上才会做对的选择
3. **怎么算完成**——验收标准，否则"完成"它说了算

大的方向没有争议，目前市面上有许多种不同的spec-driven开发工具包，到底应该选哪一个呢？

## 主流 Spec 工具

### Spec Kit（github/spec-kit）

GitHub 出品，SDD 概念能破圈它功不可没。

**优点：**
- 官方正统，宪法机制——项目先立工程原则，天然就是团队共识的载体
- clarify 环节——AI 反过来拷问你模糊地带，很多需求漏洞就是这一步堵上的
- 完整流水线：constitution → specify → clarify → plan → tasks + implement

**缺点：**
- 太重——写个三天的小工具也得走五道工序，像去门口取快递还要做访客登记
- 上手成本高——你得先想清楚宪法写什么，团队要达成共识才能开始
- 适合新项目，对存量项目偏重

### Superpowers（obra/superpowers）

作者 Jesse Vincent 是开源圈老兵。一句话讲清它：**把工程师的纪律写成文本，开工时塞进 AI 脑子里**。

**优点：**
- 完整方法论：brainstorm → plan → TDD → review，纪律很硬
- 对症下药——brainstorm 治脑补，TDD + review 治偷懒，plan 落盘治遗忘
- 严格教练——没测试不许说做完，plan 没确认不许动手

**缺点：**
- 太严——是教练不是自助餐，接受它就得接受整套流程，不能挑
- 流程税重——每次开工都要走完整流程，小改动也得遵守纪律
- 不是加个插件，是换整个开发方式，想清楚再上车

### OpenSpec（fission-ai/openspec）

切入点很刁：市面上的 SDD 教程都默认你在起一个新项目，但现实中你九成时间面对的，是一个已经存在、装满了既成事实的代码库。

**优点：**
- 轻量——两个文件夹：specs 存现状，changes 存变更提案，结构简单到感人
- 专为存量项目设计——改支付模块之前，你想对齐的只是"这一次变更动什么"
- 循环机制——提案 → 人机确认 → 实施 → 归档合并回 specs，说明书永远是新的
- 通用——markdown + CLI，各家 AI 工具都能用

**缺点：**
- 太散——只管"改什么"不管"怎么改"，没有执行层的纪律约束
- 不管质量——变更提案写得好，但实施过程没有 TDD、没有 review
- 靠自觉，团队推广弱


## Matt Skills：老司机的私家手账

看了这么多数据和横评，我最后留下来的是 **Matt Skills**。

作者 Matt Pocock，Total TypeScript 作者。仓库介绍叫 *Skills for Real Engineers*——给真实工程的，不是给 demo 的。中文社区戏称"码头 skills"——Matt ≈ 码头。

哲学跟前三套都不同：**不是给你流程让你遵守，而是把老手踩过的坑封装成小补丁**。没按说的做？有 skill 管。改 A 破坏 B？有 skill 管。决策聊完就丢？有 skill 沉淀。所以真正决定用哪个的时候，还得你自己来决定。

每个 skill 单独可用：凑齐是工作流，拆开是急救包。而且它是活的——Matt 天天用、迭代飞快，每个版本都是真实项目喂出来的。

### 安装

两步搞定：

```bash
# 1. 安装技能集，可按需安装
npx skills@latest add mattpocock/skills

# 2. 初始化（每个仓库只需执行一次）
/setup-matt-pocock-skills
```

装完下次对话就自动生效了，无需手动配置 AGENTS.md 或 CLAUDE.md。

### 五星推荐：日常必用的 5 个 skill

| 命令 | 作用说明 | 生成物 |
|------|----------|--------|
| `/grilling <描述>` | 轻量版需求访谈，只拷问、不写文档 | 对话输出 |
| `/grill-with-docs <描述>` | 深度需求访谈，自动更新领域词典 | CONTEXT.md + docs/adr/NNNN-xxx.md |
| `/tdd` | 严格 TDD：先写 failing test 再写实现 | 测试 + 实现文件 + 多次小 commit |
| `/diagnosing-bugs` | 标准化缺陷排查 | 假设 + 验证方案 + 可能新增回归测试 |
| `/ask-matt` | 技能路由：不知道用哪个时问它 | 推荐合适的 skill |

### 更多实用 skill

| 命令 | 作用 | 推荐度 |
|------|------|--------|
| `/to-spec` | 总结为技术规格并发布到 issue | ⭐⭐⭐⭐ |
| `/implement` | 按 spec 实现代码，自带完工纪律 | ⭐⭐⭐⭐ |
| `/code-review` | 工程规范与安全性代码审查 | ⭐⭐⭐⭐ |
| `/prototype` | 快速原型验证 | ⭐⭐⭐ |
| `/handoff` | 会话摘要，便于新窗口继续 | ⭐⭐⭐ |
| `/research` | 技术调研 | ⭐⭐⭐ |
| `/to-tickets` | 将方案拆解为工单 | ⭐⭐⭐ |
| `/triage` | 批量管理 Issue 状态 | ⭐⭐ |
| `/resolving-merge-conflicts` | 辅助解决合并冲突 | ⭐⭐ |
| `/improve-codebase-architecture` | 架构审查与优化建议 | ⭐ |

## 按需求清晰度分三档

- **大需求、模糊** → `/wayfinder`：不急着冲向终点，把模糊路线画成 issue tracker 上的决策地图，一张票一张票消除不确定性
- **中等、拿不准** → `/grill-me`：让 AI 反过来面试你，把模糊地带一个个拷问出来，问到你能拍板为止
- **小需求、明确** → 直接开工：对齐成本比收益还高，别为了流程而流程

## 三种靠谱组合

### 轻量派：急救包模式

`/setup` → `/plan` → `/grill-me`

适合：工作流已顺手，只有具体痛点。

### 均衡派：日常开发模式

`grill-with-docs` → `/implement` → `/review`

适合：中等需求，想要纪律但不想太重。

### 完整派：全栈工作流

`/setup` + `/wayfinder` → `/plan` + `/tdd` → `/implement` + `/review`

适合：新项目、大重构，想要完整纪律。

## 搭你自己的工作流

三步：

1. **识别痛点**——你最常踩什么坑？脑补？偷懒？遗忘？
2. **挑选 skill**——每个 skill 治什么病，对照着选
3. **组合使用**——按需求类型切换组合，不固定

## 如何落地

不要把这套 Skill 当作必须从头跑到尾的仪式。更稳妥的做法是按风险组合。

需求模糊时先`/grill-with-docs`，需要可运行证据时用`/prototype`，明确需求进入`/implement`；实现过程中用`/tdd`建反馈环，交付前用`/code-review` 做 Standards/ Spec 双轴检查。大规模变更再引入 `/to-spec` → `/to-tickets`。

---

## 补充：技能包到底有没有用？

有开发者用前沿实验室同款基准（SWE-bench Pro 与 SlopCodeBench）做了两个月的对照实验：每月重跑同一批技能包，全部以当月无技能基线为参照，[原文链接](https://orcabot.com/benchmarks/agent-skills)。

测试的技能包：Superpowers、Git Ship Done (GSD)、Oh My ClaudeCode (OMC)、Karpathy Skills、Agent Skills。


同一个框架、同一个模型名，无技能基线一个月内自己在 SWE-bench Pro 上涨了 **2.76 个百分点**——超过任何技能包相对它的优势。OpenAI 在服务端悄悄改进了模型，任何版本号都无从锚定。

于是六月「技能全胜基线」的头条结论没能撑过一个月：七月 GSD 和新入组的 Agent Skills 直接跑输基线——基线在它脚下涨得更快。

GSD 在文中原话就是"把一个想法变成耐用的规格说明和阶段划分"，Superpowers 的 brainstorm→plan→implement 也是同一族——它们都是 SDD 工作流被打包成 skill 的形态。于是那组数据给了 SDD 三个不太好听的限定：它没让代码更不破。 而"少犯错"恰恰是多数 SDD 工具的第二条卖点。所以别指望 spec 提升正确率。它的收益高度依赖任务形态。 陌生大仓 + 单 issue + 一次评估（SWE-bench Pro）上有小幅正收益；从零起建 + 逐检查点演进（SlopCodeBench）上净负面——因为流程开销在没有既有证据可挖时只抢注意力。数字有保质期。 同版本模型一个月自涨 2.76pp，意味着今天 SDD 工具的"提升"里有多少是模型自己的钱，谁也没重测过。

**结论：** 以同时段基线为尺，公开工作流技能总体收效平平，谁赢取决于任务、指标和模型本身。技能包更新以周计，任何结论都有保质期。适当的规范是有助于提升整体收益的。


工作流没有标准答案，适合你的才是最好的。从 Matt Skills 开始：`/setup` 立规则、`/wayfinder` 画地图、`/grill-me` 拷问模糊——哪个疼装哪个，五分钟见效。
