############################################################
# Dockerfile to build user container images
############################################################
# Set the base image to Ubuntu
FROM ubuntu
# Add app to the image
ADD ./user /home/app/bin
# Run APP
ENTRYPOINT [ "/home/app/bin/user" ] 
