#!/bin/bash
http --auth-type edgegrid -a otaadmin1purge: POST :/ccu/v3/invalidate/cpcode/staging < ./purge.json
