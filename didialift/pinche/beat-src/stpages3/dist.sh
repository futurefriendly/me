#!/bin/bash

export FIS_BUILD_STATE="online"

beat release -c -D -d dist -o --md5
