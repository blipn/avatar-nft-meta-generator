# Avatar generator

This is a little Api and a command line tool built with node.js used to procedurally generate 2D avatars with body parts from the images folder and export it as NFT metadata

You are free to customize this tool and create your own NFT collection or just to make awesome avatars 😉

# Command tool :

- ## First install dependences
```shell
> yarn
```
- ## Generate X random avatars
```shell
> yarn avatar [amount] [filename]
```
> Do not include the .json extension in your filename command

for exemple :
```shell
> yarn avatar 10000 myExport
```

> This will output a JSON file at the project root that contains an array of Base64 Stringified Buffers

- ## Export metadata
```shell
> yarn meta [filename]
```

for exemple :
```shell
> yarn meta myExport
```

> This will output a JSON files for each avatar generated in a "output" folder at projecty root

Outputs have this universal metadata structure that feat well with Opensea and other NFT marketplaces : 
```json
{
  "name":"Blimp n°0",
  "description":"This is an awesome Blimp",
  "image":"data:image/png;base64,iVBORw....0KGgoAAA",
  "attributes":[
    {"trait_type":"hairColor","value":"#053872"},
    {"trait_type":"backgroundColor","value":"#2d0c7a"},
    {"trait_type":"bodyColor","value":"#74e0d2"},
    {"trait_type":"topColor","value":"#e3f282"},
    {"trait_type":"botColor","value":"#e5c75b"},
    {"trait_type":"glassColor","value":"#27b255"},
    {"trait_type":"modulate","value":-29},
    {"trait_type":"eyesHue","value":200},
    {"trait_type":"modulateShoes","value":144},
    {"trait_type":"topOrBodyRDM","value":3},
    {"trait_type":"boldRDM","value":8},
    {"trait_type":"cyclopRDM","value":6},
    {"trait_type":"glassRDM","value":1},
    {"trait_type":"tatooRDM","value":1},
    {"trait_type":"signRDM","value":5},
    {"trait_type":"bot","value":"b2.png"},
    {"trait_type":"background","value":"bg5.png"},
    {"trait_type":"arm","value":"a3.png"},
    {"trait_type":"body","value":"b3.png"},
    {"trait_type":"glasses","value":"g2.png"},
    {"trait_type":"eye","value":"eye2.png"},
    {"trait_type":"leg","value":"l1.png"},
    {"trait_type":"hair","value":"h1.png"},
    {"trait_type":"mouth","value":"mouth4.png"},
    {"trait_type":"head","value":"body2.png"},
    {"trait_type":"neck","value":"n0.png"},
    {"trait_type":"noze","value":"noze1.png"},
    {"trait_type":"shoes","value":"s5.png"},
    {"trait_type":"top","value":"t0.png"},
    {"trait_type":"tatoo","value":"t3.png"},
    {"trait_type":"sign","value":"s84.png"},
    {"trait_type":"arm2","value":"a7.png"}
  ]
}
```


# Api :

You can run the api with :
```shell
> yarn dev
```

The default app is listenning on Port **8080**

Some routes are available at **/api/v1/avatar/** :

- **/api/v1/avatar/**
- **/api/v1/avatar/:id**

> These routes display a new random or selected avatar in an HTML page

> The ?json=true query parameter allow you to retrieve a JSON object with the base64 avatar

- **/api/v1/avatar/data/:id**

> This route allow you to retrieve a JSON object with the metadata of a chosen avatar

> If you pass the ID param in your request you must have a data.json file at the root of the project

