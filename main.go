//go:generate go run github.com/go-bindata/go-bindata/go-bindata -o ./pkg/bindata/bindata.go -pkg bindata -modtime 1557785965 -mode 0644 ./dist/...

package main

import (
	"flag"
	"fmt"
	"net/http"

	"github.com/rancher/magellan/pkg/server"
	"github.com/sirupsen/logrus"
)

func main() {
	if err := mainErr(); err != nil {
		logrus.Fatal(err)
	}
}

func mainErr() error {
	var (
		listen     string
		kubeconfig string
	)

	flag.StringVar(&listen, "listen", "localhost:8002", "Listen address")
	flag.StringVar(&kubeconfig, "kubeconfig", "", "Kube config file")
	flag.Parse()

	server, err := server.Handler(kubeconfig)
	if err != nil {
		return err
	}

	fmt.Printf("UI available at http://%s\n", listen)
	return http.ListenAndServe(listen, server)
}
