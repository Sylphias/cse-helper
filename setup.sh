cd ./frontend-sutd-ca && docker build -t fe-sutd:v1 .
cd ../backend-sutd-ca && docker build -t be-sutd:v1 .

docker run -d -p 80:3000 --name fe-sutd-1 fe-sutd:v1
docker run -d -p 8000:8000 --name be-sutd-1 be-sutd:v1