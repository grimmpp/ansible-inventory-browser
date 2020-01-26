var data = {"messages":[{"type":"message","issue":"warning","resourceType":"folder structure","resource":"group_vars","inventory":"inventory1","details":"Folder 'group_vars' does not exit!"},{"type":"message","issue":"warning","resourceType":"folder structure","resource":"host_vars","inventory":"inventory1","details":"Folder 'host_vars' does not exit!"},{"type":"message","issue":"warning","resourceType":"folder structure","resource":"group_vars","inventory":"inventory2","details":"Folder 'group_vars' does not exit!"},{"type":"message","issue":"warning","resourceType":"folder structure","resource":"host_vars","inventory":"inventory2","details":"Folder 'host_vars' does not exit!"},{"type":"message","issue":"warning","resourceType":"folder structure","resource":"host_vars","inventory":"inventory3","details":"Folder 'host_vars' does not exit!"},{"type":"message","issue":"exception","resourceType":"host","resource":"middleware01","inventory":"inventory4","details":"Found folder for host 'middleware01' which is not entered in hosts file."},{"type":"message","issue":"exception","resourceType":"host","resource":"test.example.com","inventory":"inventory5","details":"Found folder for host 'test.example.com' which is not entered in hosts file."}],"ui-config":{"host-view":{"header":["Hostname","Groups","Ansible Host IP","Environment"],"event-type":"selectedHost","columns":["name","groups","IPv4-Address","environment_label"]},"group-view":{"header":["Name","Host Count","Type","Environment","Inventory"],"event-type":"selectedGroup","columns":["name","host-count","type","environment_label","inventory"],"subtreeProperty":"nodes"},"message-view":{"header":["Issue","Resource Type","Resource","Inventory"],"event-type":"selectedMessage","columns":["issue","resourceType","resource","inventory"]}},"inventories":[{"filenameFullPath":"example-inventories/inventory1/hosts","filename":"hosts","dir":"example-inventories/inventory1","name":"inventory1","env":"env1","hostsFileFormat":"ini","shortcutsConfig":[{"resource-type":"group","name":"host-count","path":"hostnames","function":"count"},{"resource-type":"host","path":"variables/username","function":"delete"},{"resource-type":"host","path":"variables/password","function":"delete"}],"tree":[{"type":"group","name":"all","hostnames":[],"subgroups":["datacenter"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;all","nodes":[{"type":"group","name":"datacenter","hostnames":[],"subgroups":["network","webservers","test"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;datacenter","nodes":[{"type":"group","name":"network","hostnames":[],"subgroups":["leafs","spines"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;network","nodes":[{"type":"group","name":"leafs","hostnames":["leaf01","leaf02"],"subgroups":[],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;leafs","nodes":[{"type":"host","name":"leaf01","groups":["leafs","test"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;leaf01"},{"type":"host","name":"leaf02","groups":["leafs"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;leaf02"}],"host-count":2},{"type":"group","name":"spines","hostnames":["spine01","spine02"],"subgroups":[],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;spines","nodes":[{"type":"host","name":"spine01","groups":["spines"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;spine01"},{"type":"host","name":"spine02","groups":["spines"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;spine02"}],"host-count":2}],"host-count":0},{"type":"group","name":"webservers","hostnames":["webserver01","webserver02"],"subgroups":[],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;webservers","nodes":[{"type":"host","name":"webserver01","groups":["webservers"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;webserver01"},{"type":"host","name":"webserver02","groups":["webservers"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;webserver02"}],"host-count":2},{"type":"group","name":"test","hostnames":["leaf01","localhost","other1.example.com","other2.example.com"],"subgroups":[],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;test","nodes":[{"type":"host","name":"leaf01","groups":["leafs","test"],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;host;leaf01"},{"type":"host","name":"localhost","groups":["test"],"inventory":"inventory1","environment_label":"env1","variables":{"ansible_connection":"local"},"findStr":"inventory1;host;localhost"},{"type":"host","name":"other1.example.com","groups":["test"],"inventory":"inventory1","environment_label":"env1","variables":{"ansible_connection":"ssh","ansible_user":"myuser"},"findStr":"inventory1;host;other1.example.com"},{"type":"host","name":"other2.example.com","groups":["test"],"inventory":"inventory1","environment_label":"env1","variables":{"ansible_connection":"ssh","ansible_user":"myotheruser"},"findStr":"inventory1;host;other2.example.com"}],"host-count":4}],"host-count":0}],"host-count":0},{"type":"group","name":"ungrouped","hostnames":[],"subgroups":[],"inventory":"inventory1","environment_label":"env1","variables":{},"findStr":"inventory1;group;ungrouped","nodes":[],"host-count":0}]},{"filenameFullPath":"example-inventories/inventory2/hosts","filename":"hosts","dir":"example-inventories/inventory2","name":"inventory2","env":"env2","hostsFileFormat":"ini","shortcutsConfig":[{"resource-type":"host","name":"IPv4-Address","path":"variables/ansible_host","function":"copy"},{"resource-type":"group","name":"host-count","path":"hostnames","function":"count"}],"tree":[{"type":"group","name":"all","hostnames":[],"subgroups":["usa"],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;all","nodes":[{"type":"group","name":"usa","hostnames":[],"subgroups":["southeast","northeast","southwest","northwest"],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;usa","nodes":[{"type":"group","name":"southeast","hostnames":[],"subgroups":["atlanta","raleigh"],"inventory":"inventory2","environment_label":"env2","variables":{"some_server":"foo.southeast.example.com","halon_system_timeout":"30","self_destruct_countdown":"60","escape_pods":"2"},"findStr":"inventory2;group;southeast","nodes":[{"type":"group","name":"atlanta","hostnames":["host1","host2"],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{"ntp_server":"ntp.atlanta.example.com","proxy":"proxy.atlanta.example.com"},"findStr":"inventory2;group;atlanta","nodes":[{"type":"host","name":"host1","groups":["atlanta"],"inventory":"inventory2","environment_label":"env2","variables":{"http_port":"80","maxRequestsPerChild":"808","ssh_port":"22"},"findStr":"inventory2;host;host1","IPv4-Address":""},{"type":"host","name":"host2","groups":["atlanta","raleigh"],"inventory":"inventory2","environment_label":"env2","variables":{"http_port":"303","maxRequestsPerChild":"909"},"findStr":"inventory2;host;host2","IPv4-Address":""}],"host-count":2},{"type":"group","name":"raleigh","hostnames":["host2","host3","jumper"],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;raleigh","nodes":[{"type":"host","name":"host2","groups":["atlanta","raleigh"],"inventory":"inventory2","environment_label":"env2","variables":{"http_port":"303","maxRequestsPerChild":"909"},"findStr":"inventory2;host;host2","IPv4-Address":""},{"type":"host","name":"host3","groups":["raleigh"],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;host;host3","IPv4-Address":""},{"type":"host","name":"jumper","groups":["raleigh"],"inventory":"inventory2","environment_label":"env2","variables":{"ansible_port":"5555","ansible_host":"192.0.2.50"},"findStr":"inventory2;host;jumper","IPv4-Address":"192.0.2.50"}],"host-count":3}],"host-count":0},{"type":"group","name":"northeast","hostnames":[],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;northeast","nodes":[],"host-count":0},{"type":"group","name":"southwest","hostnames":[],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;southwest","nodes":[],"host-count":0},{"type":"group","name":"northwest","hostnames":[],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;northwest","nodes":[],"host-count":0}],"host-count":0}],"host-count":0},{"type":"group","name":"ungrouped","hostnames":[],"subgroups":[],"inventory":"inventory2","environment_label":"env2","variables":{},"findStr":"inventory2;group;ungrouped","nodes":[],"host-count":0}]},{"filenameFullPath":"example-inventories/inventory3/inventory.yml","filename":"inventory.yml","dir":"example-inventories/inventory3","name":"inventory3","env":"env3","hostsFileFormat":"yml","shortcutsConfig":[{"resource-type":"host","name":"IPv4-Address","path":"variables/ansible_host","function":"copy"},{"resource-type":"group","name":"host-count","path":"hostnames","function":"count"}],"tree":[{"type":"group","name":"all","hostnames":[],"subgroups":["usa"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;all","nodes":[{"type":"group","name":"usa","hostnames":[],"subgroups":["southeast","northeast","northwest","southwest"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;usa","nodes":[{"type":"group","name":"southeast","hostnames":[],"subgroups":["atlanta","raleigh"],"inventory":"inventory3","environment_label":"env3","variables":{"some_server":"foo.southeast.example.com","halon_system_timeout":30,"self_destruct_countdown":60,"escape_pods":2},"findStr":"inventory3;group;southeast","nodes":[{"type":"group","name":"atlanta","hostnames":["host1","host2"],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{"atlanta_group_info":42},"findStr":"inventory3;group;atlanta","nodes":[{"type":"host","name":"host1","groups":["atlanta"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;host;host1","IPv4-Address":""},{"type":"host","name":"host2","groups":["atlanta","raleigh"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;host;host2","IPv4-Address":""}],"host-count":2},{"type":"group","name":"raleigh","hostnames":["host2","host3","jumper"],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{"raleigh_group_info":84},"findStr":"inventory3;group;raleigh","nodes":[{"type":"host","name":"host2","groups":["atlanta","raleigh"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;host;host2","IPv4-Address":""},{"type":"host","name":"host3","groups":["raleigh"],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;host;host3","IPv4-Address":""},{"type":"host","name":"jumper","groups":["raleigh"],"inventory":"inventory3","environment_label":"env3","variables":{"ansible_port":5555,"ansible_host":"192.0.2.50"},"findStr":"inventory3;host;jumper","IPv4-Address":"192.0.2.50"}],"host-count":3}],"host-count":0},{"type":"group","name":"northeast","hostnames":[],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;northeast","nodes":[],"host-count":0},{"type":"group","name":"northwest","hostnames":[],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;northwest","nodes":[],"host-count":0},{"type":"group","name":"southwest","hostnames":[],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;southwest","nodes":[],"host-count":0}],"host-count":0}],"host-count":0},{"type":"group","name":"ungrouped","hostnames":[],"subgroups":[],"inventory":"inventory3","environment_label":"env3","variables":{},"findStr":"inventory3;group;ungrouped","nodes":[],"host-count":0}]},{"filenameFullPath":"example-inventories/inventory4/hosts","filename":"hosts","dir":"example-inventories/inventory4","name":"inventory4","env":"env4","hostsFileFormat":"ini","shortcutsConfig":[{"resource-type":"host","name":"IPv4-Address","path":"variables/ansible_host","function":"copy"},{"resource-type":"group","name":"host-count","path":"hostnames","function":"count"}],"tree":[{"type":"group","name":"all","hostnames":[],"subgroups":["datacenter"],"inventory":"inventory4","environment_label":"env4","variables":{},"findStr":"inventory4;group;all","nodes":[{"type":"group","name":"datacenter","hostnames":[],"subgroups":["databases","webservers"],"inventory":"inventory4","environment_label":"env4","variables":{},"findStr":"inventory4;group;datacenter","nodes":[{"type":"group","name":"databases","hostnames":["database01","database02","database03"],"subgroups":[],"inventory":"inventory4","environment_label":"env4","variables":{"shared_network":{"network_default_gateway":"10.132.132.1","network_netmask":"255.255.255.192","network_cidr":12,"network_address":"10.132.132.0","network_reverse_zone":"192.132.132.in-addr.arpa"}},"findStr":"inventory4;group;databases","nodes":[{"type":"host","name":"database01","groups":["databases"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"database server","mos_prompt_label":"central db"}},"findStr":"inventory4;host;database01","IPv4-Address":""},{"type":"host","name":"database02","groups":["databases"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"database server","mos_prompt_label":"central db"}},"findStr":"inventory4;host;database02","IPv4-Address":""},{"type":"host","name":"database03","groups":["databases"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"database server","mos_prompt_label":"central db"}},"findStr":"inventory4;host;database03","IPv4-Address":""}],"host-count":3},{"type":"group","name":"webservers","hostnames":["webserver01","webserver02","webserver03","webserver04"],"subgroups":[],"inventory":"inventory4","environment_label":"env4","variables":{"vm_data":{"rhv_create_vms_description":"webserver","rhv_create_vms_rhv_role":"rhv-guest","rhv_create_vms_vcpus":1,"rhv_create_vms_memory":2048,"rhv_create_vms_cluster":"WS1","rhv_create_vms_disks":{"system":{"rhv_create_vms_storage_domain":"hosted_storage","rhv_create_vms_size":30,"rhv_create_vms_bootdisk":true}}}},"findStr":"inventory4;group;webservers","nodes":[{"type":"host","name":"webserver01","groups":["webservers"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"webserver","mos_prompt_label":"distributed webserver"}},"findStr":"inventory4;host;webserver01","IPv4-Address":""},{"type":"host","name":"webserver02","groups":["webservers"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"webserver","mos_prompt_label":"distributed webserver"}},"findStr":"inventory4;host;webserver02","IPv4-Address":""},{"type":"host","name":"webserver03","groups":["webservers"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"webserver","mos_prompt_label":"distributed webserver"}},"findStr":"inventory4;host;webserver03","IPv4-Address":""},{"type":"host","name":"webserver04","groups":["webservers"],"inventory":"inventory4","environment_label":"env4","variables":{"ansible_port":"5555","ansible_host":"192.0.2.50","desc":{"host_description":"webserver","mos_prompt_label":"distributed webserver"}},"findStr":"inventory4;host;webserver04","IPv4-Address":"192.0.2.50"}],"host-count":4}],"host-count":0}],"host-count":0},{"type":"group","name":"ungrouped","hostnames":["middleware01"],"subgroups":[],"inventory":"inventory4","environment_label":"env4","variables":{},"findStr":"inventory4;group;ungrouped","nodes":[{"type":"host","name":"middleware01","groups":["ungrouped"],"inventory":"inventory4","environment_label":"env4","variables":{"desc":{"host_description":"middleware server","mos_prompt_label":"middleware server"}},"findStr":"inventory4;host;middleware01","IPv4-Address":""}],"host-count":1}]},{"filenameFullPath":"example-inventories/inventory5/inventory.yaml","filename":"inventory.yaml","dir":"example-inventories/inventory5","name":"inventory5","env":"env5","hostsFileFormat":"yaml","shortcutsConfig":[{"resource-type":"host","name":"host-desc","path":"variables/desc/host_description","function":"copy"},{"resource-type":"host","name":"label","path":"name","function":"copy"},{"resource-type":"host","name":"IPv4-Address","path":"variables/ansible_host","function":"copy"},{"resource-type":"host","name":"group-count","path":"groups","function":"count"},{"resource-type":"group","name":"host-count","path":"hostnames","function":"count"}],"tree":[{"type":"group","name":"all","hostnames":["mail.example.com"],"subgroups":["webservers","dbservers","east","west","prod","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;all","nodes":[{"type":"group","name":"webservers","hostnames":["foo.example.com","bar.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;webservers","nodes":[{"type":"host","name":"foo.example.com","groups":["webservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;foo.example.com","host-desc":"","label":"foo.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"bar.example.com","groups":["webservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;bar.example.com","host-desc":"","label":"bar.example.com","IPv4-Address":"","group-count":3}],"host-count":2},{"type":"group","name":"dbservers","hostnames":["one.example.com","two.example.com","three.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;dbservers","nodes":[{"type":"host","name":"one.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;one.example.com","host-desc":"","label":"one.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"two.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;two.example.com","host-desc":"","label":"two.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"three.example.com","groups":["dbservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;three.example.com","host-desc":"","label":"three.example.com","IPv4-Address":"","group-count":3}],"host-count":3},{"type":"group","name":"east","hostnames":["foo.example.com","one.example.com","two.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;east","nodes":[{"type":"host","name":"foo.example.com","groups":["webservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;foo.example.com","host-desc":"","label":"foo.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"one.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;one.example.com","host-desc":"","label":"one.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"two.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;two.example.com","host-desc":"","label":"two.example.com","IPv4-Address":"","group-count":3}],"host-count":3},{"type":"group","name":"west","hostnames":["bar.example.com","three.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;west","nodes":[{"type":"host","name":"bar.example.com","groups":["webservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;bar.example.com","host-desc":"","label":"bar.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"three.example.com","groups":["dbservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;three.example.com","host-desc":"","label":"three.example.com","IPv4-Address":"","group-count":3}],"host-count":2},{"type":"group","name":"prod","hostnames":["foo.example.com","one.example.com","two.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;prod","nodes":[{"type":"host","name":"foo.example.com","groups":["webservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;foo.example.com","host-desc":"","label":"foo.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"one.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;one.example.com","host-desc":"","label":"one.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"two.example.com","groups":["dbservers","east","prod"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;two.example.com","host-desc":"","label":"two.example.com","IPv4-Address":"","group-count":3}],"host-count":3},{"type":"group","name":"test","hostnames":["bar.example.com","three.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;test","nodes":[{"type":"host","name":"bar.example.com","groups":["webservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;bar.example.com","host-desc":"","label":"bar.example.com","IPv4-Address":"","group-count":3},{"type":"host","name":"three.example.com","groups":["dbservers","west","test"],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;host;three.example.com","host-desc":"","label":"three.example.com","IPv4-Address":"","group-count":3}],"host-count":2},{"type":"host","name":"mail.example.com","groups":["all"],"inventory":"inventory5","environment_label":"env5","variables":{"desc":{"host_description":"mail server","mos_prompt_label":"mail server"}},"findStr":"inventory5;host;mail.example.com","host-desc":"mail server","label":"mail.example.com","IPv4-Address":"","group-count":1}],"host-count":1},{"type":"group","name":"ungrouped","hostnames":["test.example.com"],"subgroups":[],"inventory":"inventory5","environment_label":"env5","variables":{},"findStr":"inventory5;group;ungrouped","nodes":[{"type":"host","name":"test.example.com","groups":["ungrouped"],"inventory":"inventory5","environment_label":"env5","variables":{"desc":{"host_description":"test server","mos_prompt_label":"test server"}},"findStr":"inventory5;host;test.example.com","host-desc":"test server","label":"test.example.com","IPv4-Address":"","group-count":1}],"host-count":1}]}]}