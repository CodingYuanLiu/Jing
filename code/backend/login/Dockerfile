############################################################
# Dockerfile to build login container images
############################################################
# Set the base image to Ubuntu
FROM ubuntu
RUN ["apt", "update"]
RUN ["apt", "install", "ca-certificates", "-y"]
# Add app to the image
ADD ./login /home/app/bin
# Run APP
CMD [ "/home/app/bin" ] 
