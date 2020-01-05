# Ansible Inventory Browser => In Progress!!!

You can already check out the example inventories within this project. To browse through the pregenerated data just clone this repo and open the [/webpage/index.html](/webpage/index.html)

To generate your own JSON data **```node ./main.js -c YOUR_CONFIG_FILE```**. After generating the data you can browse it through on the webpage: [/webpage/index.html](/webpage/index.html)

## Running in Docker

For those of you who don't have `node` installed on their machine, you can run everything inside a Docker container.

First *build* the container for the inventory browser via

```bash
docker build  -t ansible-inventory-browser .
```

You can then *run* the container to generate the data (as a one-off command) via

```bash
docker run -it \
    -v $(pwd)/webpage/generated-data:/app/webpage/generated-data:rw \
    -v $(pwd):/conf \
    -e ANSIBLE_INVENTORY=/conf/inventory.conf \
    ansible-inventory-browser
```

where

* `-v $(pwd)/webpage/generated-data:/app/webpage/generated-data:rw` mounts the directory with the generated data to be shown in the browser
* `-v $(pwd):/conf` mounts the current directory to access the inventory config file
* `-e ANSIBLE_INVENTORY=/conf/inventory.conf` points to the config file inside the container

Afterwards, you can open `webpage/index.html` from your local machine in your browser.
