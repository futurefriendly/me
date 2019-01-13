#!/bin/bash

# @description Generate PMS file list
# @example
# sh pms.sh BASEREVISION 

BASEREVISION=$1
CHANGELISTFILE=_change.lst
REPOPATH=""
CURREVISION=""

svn up 
svn diff -r$BASEREVISION \
    | grep -E "^Index:" \
    | sort \
    | uniq \
    | awk '{print $2}' > $CHANGELISTFILE 

REPOPATH=`svn info | grep -E "^URL:" | awk '{print $2}'`
CURREVISION=`svn info | grep -E "^Revision:" | awk '{print $2}' `

for i in `cat $CHANGELISTFILE`; do
    echo "$REPOPATH/$i $CURREVISION"
done

rm $CHANGELISTFILE
