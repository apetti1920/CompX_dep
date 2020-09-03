<div align="center">
  <img src="https://github.com/apetti1920/Compx/blob/master/Resources/banner.jpeg">
</div>

# CompX

---

> A visual, simple and fast Python block language for computation and simulation.

**Badges**

- In Development
- **Issues:**
  - Needs compiler and front end built

---

## Background

&nbsp;&nbsp;&nbsp;&nbsp;The project utilizes a .Net core backend to handle the graph creation and execution which are marked by the Graph Library and Graph Builder libraries respectively.  The Graph Library holds block components which can be altered to have an arbetrary number of ports of various types and are connected to other blocks with edges.  The graph data structure includes useful utilities to analyse and run the graph in the correct sorting order.

&nbsp;&nbsp;&nbsp;&nbsp;The Graph Builder then autimates the creation of the blocks from JSON files located on disk to represent the addition of blocks to the canvas.  The Graph Builder also utilizes the C# roslyn compiler to dynamically build and run the newly created graph.

&nbsp;&nbsp;&nbsp;&nbsp;The CompX_UI project aims to use .Net to host a react application packaged for crossplatform use with the help of [Electron.NET](https://github.com/ElectronNET/Electron.NET).  Utilizing the power of electron, the frontend can be developed using familiar Javascript and CSS while leveraging the agility of the React framework.

---

## Install

Beginning guide to installing and developing the CompX software.

Reinstall all dotnet nuget packages

```bash
$ dotnet restore
```

Install the Electron.Net CLI (*Only Done Once*)

```bash
$ dotnet tool install ElectronNET.CLI -g
```

Start the electron application

```bash
$ electronize start
```

---

## UI Current
<div align="center">
  <img src="https://github.com/apetti1920/Compx/blob/master/Resources/ui_design.png">
</div>
---

## Example Graph

<img style="float: right;" src="https://github.com/apetti1920/Compx/blob/master/Resources/sample_graph.png">

