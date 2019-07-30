############################################################
# Dockerfile to build activity container images
############################################################
# Set the base image to Ubuntu
FROM ubuntu
# Add app to the image
ADD ./main /home/app/bin
ADD ./dict/ /home/app/dict/
# Run APP
CMD [ "/home/app/bin" ] 