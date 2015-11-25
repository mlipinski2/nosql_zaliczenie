# nosql_zaliczenie
Projekt zespolowy stworzony na zaliczenie zajec czesci laboratoryjnej nosql

osoby:
Michał Lipiński
Mariusz Piątek


## zalozenie 
Zalozeniem w tym cwiczeniu przeze mnie i Mariusza bylo sprawdzenie jak mongodb bedzie dzialalo w systemie ktory zostal poddany wirtualizacji, tymsamym bedziemy badac dwie maszyny:

### struktura fizyczna

- VMware HOST (warstwa fizyczna)

sytem: Windows 10 Pro x64
RAM: 16GB
procesor: AMD FX-8320 (8 core)
dysk: WDC WD20EURX-64 (2TB dysk cache 64MB rotation 7200RPM)

### struktura zwirtualizowana

- VM z mongodb (warstwa zwirtualizowana)

system: Ubuntu 15.10 x64
RAM: 4GB
procesor: 4 zwirtualizowane procesory
dysk: zwirtualizowany 100GB w pojedynczym pliku vmdk
