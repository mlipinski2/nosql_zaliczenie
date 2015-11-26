# nosql_zaliczenie
Projekt zespolowy stworzony na zaliczenie zajec czesci laboratoryjnej nosql

osoby:
* Michał Lipiński
* Mariusz Piątek


## zalozenie 
Zalozeniem w tym cwiczeniu przeze mnie i Mariusza bylo sprawdzenie jak mongodb bedzie dzialalo w systemie ktory zostal poddany wirtualizacji.
Do testow uzylismy sporej bazy z [reddit](https://www.reddit.com/r/datasets/comments/3bxlg7/i_have_every_publicly_available_reddit_comment), wielkosc ~5,5GB
po rozpakowaniu plik json ~32GB, ilosc rekordow 53 851 542 obiekty.
tym samym bedziemy badac dwie maszyny:

### struktura fizyczna

* VMware HOST (warstwa fizyczna)

  * sytem: Windows 10 Pro x64
  * RAM: 16GB
  * procesor: AMD FX-8320 (8 core)
  * dysk: WDC WD20EURX-64 (2TB dysk cache 64MB rotation 7200RPM)

### struktura zwirtualizowana

* VM z mongodb (warstwa zwirtualizowana)

  * system: Ubuntu 15.10 x64
  * RAM: 4GB
  * procesor: 4 zwirtualizowane procesory
  * dysk: zwirtualizowany 100GB w pojedynczym pliku vmdk

## import do mongodb

* odpalamy baze mongo db

```sh
mongod --cpu --directoryperdb --dbpath /home/luis/mongo
```

* importujemy baze do mongodb

```sh
time bunzip2 -c RC_2015-01.bz2 | mongoimport --drop -d mongo -c reddit
```
