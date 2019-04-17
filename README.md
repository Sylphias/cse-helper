# cse-helper
Web portal to automate Certificate Signing for CSE assignment @ SUTD. This is to help reduce workload of professors.

# Setup 
The Web portal consists of a frontend running on React and a backend running on node. Docker will be used to containerize both applications to be deployed on various servers/environments.

## Setup .env Files
There are 2 .env files, one located in frontend-sutd-ca and the other in backend-sutd-ca. 
You only need to fill up the .env file in frontend-sutd-ca with the hostname/ip of the server you are running the backend container on.

## Building the docker images
Next run setup.sh to build both docker images on the host. Ensure that you are in the root directory of the project (cse-helpers)

[TODO : FINISH DOCUMENTATION]
## Not Included in this Repo
The SUTD cert used to sign the .csr files. Those need to be copied over to the server.

# Credits:
This app was created by Koh Kai Wei - Class of 2018 ISTD.