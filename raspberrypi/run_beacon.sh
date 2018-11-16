HWID='01 1D 2D FF BF'

ADVERTISE_DATA="13 02 01 06 03 03 6F FE 0B 16 6F FE 02 ${HWID} 7F 00"

sudo hciconfig hci0 up

sudo hcitool -i hci0 cmd 0x08 0x0008 ${ADVERTISE_DATA}

sudo hciconfig hci0 leadv 3
