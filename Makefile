
PACKAGE_NAME=wareki_conv_webextension
PACKAGE_DIR=${PACKAGE_NAME}

relase:
	rm -rf ${PACKAGE_DIR}
	rm -rf ./${PACKAGE_NAME}.zip
	mkdir ${PACKAGE_DIR}
	cp -r *.js *.json icons ${PACKAGE_DIR}/
	cd ${PACKAGE_DIR} && zip -r ../${PACKAGE_NAME}.zip *
	rm -rf ${PACKAGE_DIR}

