# version numbers for various packages
POSTGRESQL_USERNAME=POSTGRESQL_USERNAME
POSTGRESQL_PORT=35432
POSTGRESQL_DATA_BASE=rentalx
POSTGRESQL_PASSWORD=PASSWORD

#MONGODB
MONGODB_USERNAME=POSTGRESQL_USERNAME
MONGODB_PORT=35432
MONGODB_DATA_BASE=rentalx
MONGODB_PASSWORD=MONGODB_PASSWORD

#REDIS
REDIS_PORT=56379
REDIS_DATA_BASE=rentalx

#GIT
GIT_PROJECT_NAME=https://github.com/Djamilson/publish-backend-rentalx.git
GIT_NAME=rentalx

#APP
PORT_APP=3335
NODE_DEPLOY=nodedeploy-server


MYUSER=deploy
# install
sudo apt update
sudo apt upgrade

# create  user

adduser $MYUSER

usermod -aG sudo $MYUSER
cd /home/$MYUSER/
mkdir .ssh
ls -a
cd .ssh/
cp ~/.ssh/authorized_keys .
ls
chown $MYUSER:$MYUSER authorized_keys
#instalar o NodeJS

# Install NODE 14.x
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

#Install YARN
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn
yarn -v


##execulte o install 

#install docke

sudo groupadd docker
sudo usermod -aG docker $USER

#install docker

docker run -d --name postgresql -e POSTGRESQL_USERNAME=$POSTGRESQL_USERNAME -e POSTGRESQL_PASSWORD=$POSTGRESQL_PASSWORD -e POSTGRESQL_DATABASE=$POSTGRESQL_DATA_BASE -p $POSTGRESQL_PORT:5432 --restart=always bitnami/postgresql:latest


#MongoDB
docker run -d --name mongodb -e MONGODB_USERNAME=$MONGODB_USERNAME -e MONGODB_PASSWORD=$MONGODB_PASSWORD -e MONGODB_DATABASE=$MONGODB_DATA_BASE -p $MONGODB_PORT:27017 --restart=always bitnami/mongodb:latest

##install o redis //para execultar as filas de email's

docker run -d --name redis -e REDIS_PASSWORD=$REDIS_PASSWORD -p $REDIS_PORT:6379 --restart=always  bitnami/redis:latest  


mkdir app
cd app
git clone $GIT_PROJECT_NAME $GIT_NAME
cd $GIT_NAME
yarn
yarn build

sudo cp ormconfig.exemple.js ormconfig.json
sudo chmod ugoa+-=rwx ormconfig.json

sudo cp .env_exemple .env
sudo chmod ugoa+-=rwx .env


sudo ufw allow $PORT_APP 
sudo ufw allow 443 
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
sudo ufw app list
sudo ufw status


###configurar ngnix
cd ~
cd /etc/nginx/sites-enabled
ls -la
rm default

cd ../sites-available
ls
sudo cp default $NODE_DEPLOY
sudo chmod ugoa+-=rwx $NODE_DEPLOY


##install pm2 para não deixar a nossa aplicação cair
cd ~
sudo yarn global add pm2
sudo pm2 completion install
cd app
cd $GIT_NAME

pm2 start dist/shared/infra/http/server.js --name $GIT_NAME
pm2 save

sudo env PATH=$PATH:/usr/bin /usr/local/share/.config/yarn/global/node_modules/pm2/bin/pm2 startup systemd -u $MYUSER --hp /home/$MYUSER



